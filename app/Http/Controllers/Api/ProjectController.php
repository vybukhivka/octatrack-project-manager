<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Jobs\ProcessProjectBackup;
use App\Models\PartLayout;
use App\Models\Project;
use App\Models\SceneLayout;
use App\Models\TrackLayout;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): ResourceCollection
    {
        $projects = $request
            ->user()
            ->projects()
            ->with(['trackLayout', 'partLayout', 'sceneLayout'])
            ->get();
        return ProjectResource::collection($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:32',
            'genre' => 'nullable|string|max:16',
        ]);

        $data = array_merge($validated, [
            'number_of_tracks' => 8,
            'duration_minutes' => 0,
            'is_done' => false,
        ]);

        $project = $request->user()->projects()->create($data);

        TrackLayout::factory(8)->create(['project_id' => $project->id]);
        PartLayout::factory(4)->create(['project_id' => $project->id]);
        SceneLayout::factory(16)->create(['project_id' => $project->id]);

        return (new ProjectResource($project))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project, Request $request): ProjectResource
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $project->load(['trackLayout', 'partLayout', 'sceneLayout']);
        return new ProjectResource($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project): ProjectResource
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:32',
            'genre' => 'nullable|string|max:16',
            'tracks' => 'required|array',
            'parts' => 'required|array',
            'scenes' => 'required|array',
            'tracks.*.id' => 'required|integer|exists:track_layouts,id',
            'tracks.*.label' => 'nullable|string|max:32',
            'parts.*.id' => 'required|integer|exists:part_layouts,id',
            'parts.*.label' => 'nullable|string|max:32',
            'scenes.*.id' => 'required|integer|exists:scene_layouts,id',
            'scenes.*.label' => 'nullable|string|max:32',
        ]);

        try {
            DB::beginTransaction();

            $project->update([
                'title' => $validated['title'],
                'genre' => $validated['genre'],
            ]);

            foreach ($validated['tracks'] as $trackData) {
                TrackLayout::where('id', $trackData['id'])
                    ->where('project_id', $project->id)
                    ->update(['label' => $trackData['label']]);
            }

            foreach ($validated['parts'] as $partData) {
                PartLayout::where('id', $partData['id'])
                    ->where('project_id', $project->id)
                    ->update(['label' => $partData['label']]);
            }

            foreach ($validated['scenes'] as $sceneData) {
                SceneLayout::where('id', $sceneData['id'])
                    ->where('project_id', $project->id)
                    ->update(['label' => $sceneData['label']]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(
                ['message' => 'Update failed', 'error' => $e->getMessage()],
                500,
            );
        }

        $project->load(['trackLayout', 'partLayout', 'sceneLayout']);

        return new ProjectResource($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Project $project): JsonResponse
    {
        if ($request->user()->id !== $project->user_id) {
            abort(403);
        }

        $project->delete();

        return response()->json(null, 204);
    }

    public function process(Project $project, Request $request): JsonResponse
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }

        $project->update(['status' => 'processing']);
        ProcessProjectBackup::dispatch($project);
        return response()->json([
            'message' => 'Project processing has started.',
        ]);
    }
}
