<?php

namespace Database\Factories;

use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrackLayout>
 */
class TrackLayoutFactory extends Factory
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
            'track_index' => $this->faker->numberBetween(1, 8),
            'label' => $this->faker->randomElement([
                'BD',
                'SD',
                'HT',
                'BL',
                'PD',
                'ST',
                'FX',
                'DL',
                'SL',
                'FL',
                'VO',
            ]),
        ];
    }
}
