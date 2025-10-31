<?php

namespace Database\Factories;

use App\Models\PartLayout;
use App\Models\Project;
use App\Models\SceneLayout;
use App\Models\TrackLayout;
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
            'title' => fake()->monthName(),
            'number_of_tracks' => fake()->numberBetween(4, 16),
            'genre' => fake()->randomElement([
                'techno',
                'electo',
                'idm',
                'ambient',
                'tech',
                'minimal',
            ]),
            'duration_minutes' => fake()->numberBetween(30, 90),
            'is_done' => fake()->boolean(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Project $project) {
            TrackLayout::factory(8)->for($project)->create();
            SceneLayout::factory(16)->for($project)->create();
            PartLayout::factory(4)->for($project)->create();
        });
    }
}
