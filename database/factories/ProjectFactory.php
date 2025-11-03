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
            'title' => $this->faker->monthName(),
            'number_of_tracks' => $this->faker->numberBetween(4, 16),
            'genre' => $this->faker->randomElement([
                'techno',
                'electo',
                'idm',
                'ambient',
                'tech',
                'minimal',
            ]),
            'duration_minutes' => $this->faker->numberBetween(30, 90),
            'is_done' => $this->faker->boolean(),
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
