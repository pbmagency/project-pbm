<?php

use App\Models\User;
use App\Models\UserAnalytic;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->withoutVite();
});

function auditRequestEvent(string $name, string $email, string $createdAt): void
{
    UserAnalytic::create([
        'session_id' => 'audit-'.uniqid(),
        'event_type' => 'conversion',
        'event_data' => [
            'type' => 'audit_request',
            'landing_source' => '/',
            'name' => $name,
            'email' => $email,
        ],
        'created_at' => $createdAt,
    ]);
}

test('only admins can view audit request contact details', function () {
    $this->get('/admin/audit-requests')->assertRedirect(route('login'));

    $this->actingAs(User::factory()->create())
        ->get('/admin/audit-requests')
        ->assertForbidden();
});

test('audit requests are paginated newest first and exclude other analytics events', function () {
    $this->actingAs(User::factory()->admin()->create());

    for ($index = 1; $index <= 22; $index++) {
        auditRequestEvent("Visitor {$index}", "visitor{$index}@example.com", "2026-09-30 10:{$index}:00");
    }

    UserAnalytic::create([
        'session_id' => 'other-conversion',
        'event_type' => 'conversion',
        'event_data' => ['type' => 'wa_inquiry', 'name' => 'Other Lead'],
        'created_at' => '2026-09-30 11:00:00',
    ]);

    $this->get('/admin/audit-requests')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('admin/audit-requests/index')
        ->has('requests.data', 20)
        ->where('requests.total', 22)
        ->where('requests.data.0.name', 'Visitor 22')
        ->etc());

    $this->get('/admin/audit-requests?page=2')->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('admin/audit-requests/index')
        ->has('requests.data', 2)
        ->where('requests.current_page', 2)
        ->etc());
});

test('audit requests can be filtered by name email and Jakarta submission date', function () {
    $this->actingAs(User::factory()->admin()->create());

    auditRequestEvent('Alya Putri', 'alya@example.com', '2026-09-29 18:00:00');
    auditRequestEvent('Budi Santoso', 'budi@example.com', '2026-09-29 16:00:00');
    auditRequestEvent('Citra Dewi', 'citra@example.com', '2026-09-30 17:00:00');

    $this->get('/admin/audit-requests?search=alya&from=2026-09-30&to=2026-09-30')
        ->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('admin/audit-requests/index')
        ->has('requests.data', 1)
        ->where('requests.data.0.name', 'Alya Putri')
        ->where('requests.data.0.email', 'alya@example.com')
        ->where('filters.from', '2026-09-30')
        ->etc());

    $this->get('/admin/audit-requests?search=budi%40example.com')
        ->assertOk()->assertInertia(fn (Assert $page) => $page
        ->has('requests.data', 1)
        ->where('requests.data.0.name', 'Budi Santoso')
        ->etc());

    $this->get('/admin/audit-requests?from=2026-09-30&to=2026-09-30')
        ->assertOk()->assertInertia(fn (Assert $page) => $page
        ->has('requests.data', 1)
        ->where('requests.data.0.name', 'Alya Putri')
        ->etc());

    $this->get('/admin/audit-requests?to=2026-09-30')->assertOk();
});
