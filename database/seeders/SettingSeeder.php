<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        Setting::updateOrCreate(['key' => 'event_date'], ['value' => '16 JULI 2026']);
        Setting::updateOrCreate(['key' => 'event_time'], ['value' => '19:00 - 20:30 WIB']);
        Setting::updateOrCreate(['key' => 'zoom_link'], ['value' => 'https://zoom.us/j/123456789']);
        Setting::updateOrCreate(['key' => 'wa_group_link'], ['value' => 'https://chat.whatsapp.com/PLACEHOLDER']);
    }
}