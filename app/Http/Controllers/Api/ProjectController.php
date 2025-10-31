<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Jobs\ProcessProjectBackup;
use App\Models\PartLayout;
use App\Models\Project;
use App\Models\SceneLayout;
use App\Models\TrackLayout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProjectResource::collection(request()->user()->projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:32',
            'genre' => 'nullable|string|max:16',
        ]);

        $project = $request->user()->projects()->create($validated);

        TrackLayout::factory(8)->create(['project_id' => $project->id]);
        PartLayout::factory(8)->create(['project_id' => $project->id]);
        SceneLayout::factory(8)->create(['project_id' => $project->id]);

        return to_route('projects');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        if ($project->user_id !== request()->user()->id) {
            abort(403, 'Unathorized');
        }

        $project->load(['trackLayout', 'partLayout', 'sceneLayout']);
        return new ProjectResource($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        if ($request->user()->id !== $project->user_id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:32',
            'genre' => 'nullable|string|max:16',
        ]);
        $project->update($validated);

        return to_route('projects');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project): JsonResponse
    {
        if ($request->user()->id !== $project->user_id) {
            abort(403);
        }

        $project->delete();

        return response()->json(null, 204);
    }

    public function process(Project $project)
    {
        $project->update(['status' => 'processing']);
        ProcessProjectBackup::dispatch($project);
        return response()->json([
            'message' => 'Project processing has started.',
        ]);
    }
}
