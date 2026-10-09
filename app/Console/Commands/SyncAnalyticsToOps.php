<?php

namespace App\Console\Commands;

use App\Models\UserAnalytic;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SyncAnalyticsToOps extends Command
{
    protected $signature = 'analytics:sync-batch {--force : Ignore watermark and sync all/recent records} {--limit=500 : Batch size per HTTP request}';

    protected $description = 'Sync recent analytics events in batches to PBM Ops Board hourly';

    public function handle(): int
    {
        $projectKey = env('PBM_OPS_PROJECT_KEY', 'project-pbm');
        $opsUrl = rtrim(env('PBM_OPS_URL', 'http://127.0.0.1:8000'), '/');
        $endpoint = "{$opsUrl}/api/analytics/batch";
        $batchLimit = (int) $this->option('limit') ?: 500;
        $force = (bool) $this->option('force');

        $watermarkFile = storage_path('app/analytics_ops_sync_watermark.json');
        $lastSyncedId = 0;

        if (! $force && File::exists($watermarkFile)) {
            $state = json_decode(File::get($watermarkFile), true);
            $lastSyncedId = (int) ($state['last_synced_id'] ?? 0);
        }

        $totalSyncedInRun = 0;
        $maxLoops = 10; // Safeguard up to 5,000 events per hourly run
        $loop = 0;

        while ($loop < $maxLoops) {
            $loop++;
            $query = UserAnalytic::query()->orderBy('id', 'asc');
            if ($lastSyncedId > 0 && ! $force) {
                $query->where('id', '>', $lastSyncedId);
            }

            $events = $query->limit($batchLimit)->get();

            if ($events->isEmpty()) {
                if ($totalSyncedInRun === 0) {
                    $this->info("No new analytics events to sync for [{$projectKey}].");
                }
                break;
            }

            $this->info("Processing batch #{$loop} ({$events->count()} events) for [{$projectKey}]...");

            $payload = $events->map(function ($event) {
                return [
                    'session_id' => (string) $event->session_id,
                    'event_type' => (string) $event->event_type,
                    'event_data' => $event->event_data,
                    'referral_source' => $event->referral_source,
                    'utm_source' => $event->utm_source,
                    'utm_medium' => $event->utm_medium,
                    'utm_campaign' => $event->utm_campaign,
                    'utm_content' => $event->utm_content,
                    'utm_term' => $event->utm_term,
                    'ip_hash' => $event->ip_hash,
                    'user_agent' => $event->user_agent,
                    'user_id' => $event->user_id,
                    'created_at' => $event->created_at ? $event->created_at->format('Y-m-d H:i:s') : now()->format('Y-m-d H:i:s'),
                ];
            })->values()->toArray();

            try {
                $response = Http::timeout(30)->post($endpoint, [
                    'project_key' => $projectKey,
                    'events' => $payload,
                ]);

                if ($response->successful()) {
                    $maxId = $events->max('id');
                    $lastSyncedId = $maxId;
                    $totalSyncedInRun += count($payload);

                    File::ensureDirectoryExists(dirname($watermarkFile));
                    File::put($watermarkFile, json_encode([
                        'last_synced_id' => $maxId,
                        'last_synced_at' => now()->toIso8601String(),
                        'batch_count' => count($payload),
                    ], JSON_PRETTY_PRINT));

                    $result = $response->json();
                    $inserted = $result['inserted'] ?? count($payload);
                    $this->info("Batch #{$loop} synced successfully: {$inserted} inserted.");
                } else {
                    $errorMsg = "Failed batch #{$loop}: HTTP {$response->status()} - {$response->body()}";
                    $this->error($errorMsg);
                    Log::error("PBM Ops Analytics Sync [{$projectKey}] error: {$errorMsg}");

                    return Command::FAILURE;
                }
            } catch (Exception $e) {
                $this->error("Connection exception on batch #{$loop}: {$e->getMessage()}");
                Log::error("PBM Ops Analytics Sync [{$projectKey}] exception: {$e->getMessage()}");

                return Command::FAILURE;
            }

            // If we received fewer items than the batch size or force was used, don't loop endlessly
            if ($events->count() < $batchLimit || $force) {
                break;
            }
        }

        if ($totalSyncedInRun > 0) {
            $this->info("Total synced for [{$projectKey}]: {$totalSyncedInRun} events in this hourly run.");
            Log::info("PBM Ops Analytics Sync [{$projectKey}]: {$totalSyncedInRun} events synced.");
        }

        return Command::SUCCESS;
    }
}
