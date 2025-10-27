<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->title(),
            'number_of_tracks' => fake()->numberBetween(4, 16),
            'genre' => fake()->word(),
            'duration_minutes' => fake()->numberBetween(30, 90),
            'is_done' => fake()->boolean(),
        ];
    }
}
