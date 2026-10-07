<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserAnalytic;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'from' => ['nullable', 'date_format:Y-m-d'],
            'to' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:from'],
        ]);

        $search = trim($filters['search'] ?? '');
        $query = UserAnalytic::query()
            ->select(['id', 'event_data', 'created_at'])
            ->where('event_type', 'conversion')
            ->where('event_data->type', 'audit_request');

        if ($search !== '') {
            $query->where(function ($matches) use ($search) {
                $matches->where('event_data->name', 'like', "%{$search}%")
                    ->orWhere('event_data->email', 'like', "%{$search}%")
                    ->orWhere('event_data->phone', 'like', "%{$search}%")
                    ->orWhere('event_data->website_link', 'like', "%{$search}%");
            });
        }

        if (isset($filters['from'])) {
            $query->where('created_at', '>=', CarbonImmutable::parse($filters['from'], 'Asia/Jakarta')->startOfDay()->utc());
        }

        if (isset($filters['to'])) {
            $query->where('created_at', '<=', CarbonImmutable::parse($filters['to'], 'Asia/Jakarta')->endOfDay()->utc());
        }

        $requests = $query->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (UserAnalytic $event): array => [
                'id' => $event->id,
                'name' => $event->event_data['name'] ?? '',
                'email' => $event->event_data['email'] ?? '',
                'phone' => $event->event_data['phone'] ?? '',
                'website_link' => $event->event_data['website_link'] ?? '',
                'program_type' => $event->event_data['program_type'] ?? '',
                'total_buyers' => $event->event_data['total_buyers'] ?? '',
                'monthly_revenue' => $event->event_data['monthly_revenue'] ?? '',
                'business_role' => $event->event_data['business_role'] ?? '',
                'is_qualified' => $event->event_data['is_qualified'] ?? null,
                'created_at' => $event->created_at->toIso8601String(),
            ]);

        return Inertia::render('admin/audit-requests/index', [
            'requests' => $requests,
            'filters' => [
                'search' => $search,
                'from' => $filters['from'] ?? '',
                'to' => $filters['to'] ?? '',
            ],
        ]);
    }
}
