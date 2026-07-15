<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConfigController extends Controller
{
    public function index()
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        
        return Inertia::render('admin/configs', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'event_date' => 'nullable|string|max:255',
            'event_time' => 'nullable|string|max:255',
            'zoom_link' => 'nullable|url|max:255',
            'wa_group_link' => 'nullable|url|max:255',
            'wa_support_number' => 'nullable|string|max:255',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return back()->with('success', 'Configurations updated successfully.');
    }
}