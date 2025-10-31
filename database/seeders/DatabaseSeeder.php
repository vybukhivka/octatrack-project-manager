<?php

namespace Database\Seeders;

use App\Models\PartLayout;
use App\Models\Project;
use App\Models\SceneLayout;
use App\Models\TrackLayout;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        $project = Project::factory()->create([
            'user_id' => $user->id,
            'title' => 'First Project',
        ]);

        TrackLayout::factory()->create(['project_id' => $project->id]);
        PartLayout::factory()->create(['project_id' => $project->id]);
        SceneLayout::factory()->create(['project_id' => $project->id]);

        Project::factory(8)->create(['user_id' => $user->id]);
    }
}
