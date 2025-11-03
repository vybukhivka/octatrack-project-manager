<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SceneLayout>
 */
class SceneLayoutFactory extends Factory
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
            'scene_index' => \fake()->numberBetween(1, 16),
            'label' => \fake()->randomElement([
                'LP',
                'HP',
                'V1',
                'V2',
                'V3',
                'V4',
                'B1',
                'B2',
                'B3',
                'B4',
                'S1',
                'S2',
                'S3',
                'S4',
                'R1',
                'R2',
                'R3',
                'R4',
            ]),
        ];
    }
}
