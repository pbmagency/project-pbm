<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'order_number' => 'PBM-' . strtoupper(fake()->bothify('????????')),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => '08' . fake()->numerify('#########'),
            'amount' => 129000,
            'payment_method' => null,
            'duitku_reference' => null,
            'status' => 'pending',
        ];
    }

    public function paid(): static
    {
        return $this->state(fn () => [
            'status' => 'paid',
            'duitku_reference' => 'DUITKU-' . strtoupper(fake()->bothify('??######')),
            'payment_method' => 'BC',
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => ['status' => 'failed']);
    }
}
