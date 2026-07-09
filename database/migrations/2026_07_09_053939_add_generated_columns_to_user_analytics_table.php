<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Stored generated columns extracted from the event_data JSON blob, each backed by an
     * index, so reporting queries can filter/group without scanning and re-parsing JSON on
     * every row. Without these, AbTestingService's aggregate queries degrade badly once
     * user_analytics grows into the tens of thousands of rows.
     */
    public function up(): void
    {
        Schema::table('user_analytics', function (Blueprint $table) {
            $table->string('landing_source', 255)->nullable()
                ->storedAs("JSON_UNQUOTE(JSON_EXTRACT(event_data, '\$.landing_source'))")->after('event_data');
            $table->decimal('scroll_depth', 5, 2)->nullable()
                ->storedAs("CAST(JSON_EXTRACT(event_data, '\$.depth') AS DECIMAL(5,2))")->after('landing_source');
            $table->bigInteger('engagement_duration_ms')->nullable()
                ->storedAs("CAST(JSON_EXTRACT(event_data, '\$.duration') AS SIGNED)")->after('scroll_depth');
            $table->string('section_id', 100)->nullable()
                ->storedAs("JSON_UNQUOTE(JSON_EXTRACT(event_data, '\$.section'))")->after('engagement_duration_ms');
            $table->string('cta_location', 100)->nullable()
                ->storedAs("JSON_UNQUOTE(JSON_EXTRACT(event_data, '\$.location'))")->after('section_id');
            $table->string('payment_status', 50)->nullable()
                ->storedAs("JSON_UNQUOTE(JSON_EXTRACT(event_data, '\$.status'))")->after('cta_location');
            $table->decimal('payment_amount', 20, 4)->nullable()
                ->storedAs("CAST(JSON_EXTRACT(event_data, '\$.amount') AS DECIMAL(20,4))")->after('payment_status');
        });

        Schema::table('user_analytics', function (Blueprint $table) {
            $table->index(['event_type', 'created_at', 'landing_source'], 'analytics_type_created_source_idx');
            $table->index(['landing_source', 'event_type'], 'analytics_source_type_idx');
            $table->index(['event_type', 'cta_location'], 'analytics_type_location_idx');
            $table->index(['event_type', 'section_id', 'created_at'], 'analytics_type_section_created_idx');
            $table->index(['event_type', 'payment_status'], 'analytics_type_status_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_analytics', function (Blueprint $table) {
            $table->dropIndex('analytics_type_created_source_idx');
            $table->dropIndex('analytics_source_type_idx');
            $table->dropIndex('analytics_type_location_idx');
            $table->dropIndex('analytics_type_section_created_idx');
            $table->dropIndex('analytics_type_status_idx');

            $table->dropColumn([
                'landing_source',
                'scroll_depth',
                'engagement_duration_ms',
                'section_id',
                'cta_location',
                'payment_status',
                'payment_amount',
            ]);
        });
    }
};
