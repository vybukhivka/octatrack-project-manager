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
            ['email' => 'check@check.com'],
            [
                'name' => 'Test User',
                'password' => 'qwer1234',
                'email_verified_at' => now(),
            ],
        );
        $project = Project::factory()->create([
            'user_id' => $user->id,
            'title' => 'First Project',
        ]);

        Project::factory(7)->create(['user_id' => $user->id]);
        User::factory(2)->has(Project::factory(3))->create();
    }
}
