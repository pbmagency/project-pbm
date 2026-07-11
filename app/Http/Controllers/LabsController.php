<?php

namespace App\Http\Controllers;

use App\Services\AbTestingService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class LabsController extends Controller
{
    public function __construct(protected AbTestingService $abTestingService) {}

    public function index(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'range' => 'nullable|in:3,5,7,14,30,custom',
            'source' => 'nullable|string',
        ]);

        $range = $request->get('range', '7');

        if ($range === 'custom') {
            $startDate = Carbon::parse($request->get('start_date', now()->subDays(7)));
            $endDate = Carbon::parse($request->get('end_date', now()))->endOfDay();
        } else {
            $days = (int) $range;
            $startDate = Carbon::now()->subDays($days)->startOfDay();
            $endDate = Carbon::now()->endOfDay();
        }

        $sourceFilter = $request->get('source');
        $sourceKey = $sourceFilter ?? 'all';
        $cacheKey = "ab_testing_{$startDate->format('Y-m-d')}_{$endDate->format('Y-m-d')}_{$sourceKey}";

        // 30-minute cache for high-traffic tolerance
        $data = Cache::remember($cacheKey, 30 * 60, function () use ($startDate, $endDate, $sourceFilter) {
            return [
                'matrix' => $this->abTestingService->getPerformanceMatrix($startDate, $endDate, $sourceFilter),
                'funnel' => $this->abTestingService->getSplitFunnel($startDate, $endDate, $sourceFilter),
                'quality' => $this->abTestingService->getQualityAnalysis($startDate, $endDate, $sourceFilter),
                'devices' => $this->abTestingService->getDevicePerformance($startDate, $endDate, $sourceFilter),
                'cta' => $this->abTestingService->getCtaPerformance($startDate, $endDate, $sourceFilter),
                'readers' => $this->abTestingService->getReaderSegmentation($startDate, $endDate, $sourceFilter),
                'heatmap' => $this->abTestingService->getScrollHeatmap($startDate, $endDate, $sourceFilter),
                'section_heatmap' => $this->abTestingService->getSectionHeatmap($startDate, $endDate, $sourceFilter),
            ];
        });

        $availableSources = $this->abTestingService->getAvailableSources($startDate, $endDate);

        if ($request->wantsJson()) {
            return response()->json([
                ...$data,
                'available_sources' => $availableSources,
                'meta' => [
                    'start_date' => $startDate->toIso8601String(),
                    'end_date' => $endDate->toIso8601String(),
                    'range' => $range,
                    'source' => $sourceFilter,
                    'cached_at' => now()->toIso8601String(),
                ],
            ]);
        }

        return Inertia::render('admin/labs/index', [
            ...$data,
            'availableSources' => $availableSources,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
                'range' => $range,
                'source' => $sourceFilter,
            ],
        ]);
    }

    public function clearCache(Request $request)
    {
        $range = $request->get('range', '7');
        $sourceFilter = $request->get('source');

        if ($range === 'custom') {
            $startDate = Carbon::parse($request->get('start_date', now()->subDays(7)));
            $endDate = Carbon::parse($request->get('end_date', now()))->endOfDay();
        } else {
            $days = (int) $range;
            $startDate = Carbon::now()->subDays($days)->startOfDay();
            $endDate = Carbon::now()->endOfDay();
        }

        $sourceKey = $sourceFilter ?? 'all';
        Cache::forget("ab_testing_{$startDate->format('Y-m-d')}_{$endDate->format('Y-m-d')}_{$sourceKey}");

        return response()->json(['success' => true, 'message' => 'Cache cleared successfully']);
    }
}