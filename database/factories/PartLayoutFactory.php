<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PartLayout>
 */
class PartLayoutFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'part_index' => $this->faker->numberBetween(1, 4),
            'label' => $this->faker->randomElement([
                'full',
                'intro',
                'outro',
                'break',
                'side',
                'part',
            ]),
        ];
    }
}
