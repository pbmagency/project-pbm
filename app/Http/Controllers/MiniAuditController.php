<?php

namespace App\Http\Controllers;

use App\Models\MiniAudit;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Mail\MiniAuditNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MiniAuditController extends Controller
{
    public function create()
    {
        return Inertia::render('mini-audit', []);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|min:2|max:100',
            'email' => 'required|email|max:255',
            'whatsapp' => 'required|string|min:8|max:20',
            'website' => 'required|url|max:500',
            'traffic' => 'required|string',
            'omzet' => 'required|string',
            'budget_iklan' => 'required|string',
            'tantangan' => 'required|string',
            'tantangan_lainnya' => 'nullable|string|max:500',
        ]);

        // Scoring logic - Qualified hanya jika omzet >= 10-25jt
        $qualifiedOmzet = in_array($validated['omzet'], ['10-25jt', '25-50jt', '50-100jt', '>100jt']);
        $isQualified = $qualifiedOmzet;

        $validated['is_qualified'] = $isQualified;

        $lead = MiniAudit::create($validated);

        // Send email notification to admin for qualified leads
        if ($isQualified) {
            try {
                $adminEmail = env('ADMIN_EMAIL', 'justinereifanwijaya@gmail.com');
                Mail::to($adminEmail)->queue(new MiniAuditNotification($lead));
            } catch (\Exception $e) {
                Log::error('Lead notification email failed: ' . $e->getMessage());
            }
        }

        if ($isQualified) {
            return Inertia::render('mini-audit', [
                'flash' => [
                    'qualified' => true
                ]
            ]);
        }

        return redirect()->route('self-audit-checklist');
    }


    public function selfAuditChecklist()
    {
        return Inertia::render('self-audit-checklist');
    }
}
