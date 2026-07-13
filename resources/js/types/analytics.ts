// ============================================================
// Analytics & Labs — Shared Type Definitions
// Matches the data shapes returned by AbTestingService.php
// and AnalyticsController.php
// ============================================================

export type AnalyticsEventType =
    | 'visit'
    | 'scroll'
    | 'engagement'
    | 'cta_click'
    | 'conversion'
    | 'payment'
    | 'section_view';

// ── Admin Analytics Dashboard ────────────────────────────────

export interface AnalyticsStats {
    total_visits: number;
    unique_visitors: number;
    engagement_rate: number;
    engaged_users: number;
    intent_rate: number;
    cta_clicks: number;
    add_to_cart_rate: number;
    conversion_rate: number;
    conversions: number;
    conversion_to_payment_rate: number;
    payment_rate: number;
    total_revenue: number;
    payments: number;
}

export interface ReferralDataItem {
    referral_source: string;
    count: number;
}

export interface FunnelStage {
    stage: string;
    count: number;
    percentage: number;
}

// ── Performance Matrix ──────────────────────────────────────

export interface MatrixItem {
    landing_source: string;
    visits: number;
    bounce_rate: number;
    intent_rate: number;
    lead_cr: number;
    strict_cr: number;
    initiate_checkout_rate: number;
    rpv: number;
    revenue: number;
    conversions: number;
    payments: number;
    cta_clicks: number;
}

// ── Split Funnel ────────────────────────────────────────────

export interface FunnelItem {
    landing_source: string;
    steps: FunnelStage[];
}

// ── Quality / Behavior Analysis ─────────────────────────────

export interface QualityMetrics {
    count: number;
    avg_scroll_depth: number;
    avg_dwell_time: number;
}

export interface QualityItem {
    landing_source: string;
    leads: QualityMetrics;
    non_leads: QualityMetrics;
}

// ── Device Performance ──────────────────────────────────────

export interface DeviceMetrics {
    visits: number;
    leads: number;
    conversion_rate: number;
}

export interface DeviceData {
    landing_source: string;
    mobile: DeviceMetrics;
    desktop: DeviceMetrics;
}

// ── CTA Performance ─────────────────────────────────────────

export interface CtaLocation {
    location: string;
    click_count: number;
    leads: number;
    lead_rate: number;
}

export interface CtaData {
    landing_source: string;
    cta_locations: CtaLocation[];
    total_clicks: number;
}

// ── Reader / Audience Segmentation ──────────────────────────

export interface Persona {
    name: string;
    description: string;
    count: number;
    percentage: number;
}

export interface ReaderData {
    landing_source: string;
    total_sessions: number;
    personas: Persona[];
}

// ── Scroll Heatmap ──────────────────────────────────────────

export interface DepthAnalysis {
    depth: number;
    sessions: number;
    percentage: number;
}

export interface HeatmapData {
    landing_source: string;
    total_visits: number;
    depth_analysis: DepthAnalysis[];
}

// ── Section Views ────────────────────────────────────────────

export interface SectionViewData {
    id: string;
    name: string;
    views: number;
    pct: number;
    drop_from_prev: number;
}

export interface SectionHeatmapItem {
    landing_source: string;
    sections: SectionViewData[];
}

// ── Filters ─────────────────────────────────────────────────

export interface LabsFilters {
    start_date: string;
    end_date: string;
    range: string;
    source?: string | null;
}

// ── Page Props ──────────────────────────────────────────────

export interface LabsPageProps {
    matrix: MatrixItem[];
    funnel: FunnelItem[];
    quality: QualityItem[];
    devices: DeviceData[];
    cta: CtaData[];
    readers: ReaderData[];
    heatmap: HeatmapData[];
    section_heatmap: SectionHeatmapItem[];
    availableSources: string[];
    filters: LabsFilters;
}

// ── Component Props ─────────────────────────────────────────

export interface DeviceComparisonProps {
    data: DeviceData[];
}

export interface CtaAnalysisProps {
    data: CtaData[];
}

export interface AudienceSegmentationProps {
    readers: ReaderData[];
    heatmap: HeatmapData[];
    sectionHeatmap: SectionHeatmapItem[];
}
