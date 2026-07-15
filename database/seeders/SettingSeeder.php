<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::updateOrCreate(['key' => 'event_date'], ['value' => '16 JULI 2026']);
        Setting::updateOrCreate(['key' => 'event_time'], ['value' => '19:00 - 20:30 WIB']);
        Setting::updateOrCreate(['key' => 'zoom_link'], ['value' => 'https://zoom.us/j/123456789']);
        Setting::updateOrCreate(['key' => 'wa_group_link'], ['value' => 'https://chat.whatsapp.com/PLACEHOLDER']);
        Setting::updateOrCreate(['key' => 'wa_support_number'], ['value' => '6285931018333']);
    }
}