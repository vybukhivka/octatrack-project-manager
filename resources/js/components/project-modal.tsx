import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from './ui/dialog';

const layoutSchema = z.object({
    id: z.number(),
    label: z.string().max(32, 'Label is too long').optional().or(z.literal('')),
});
const projectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(32, 'Title is too long'),
    genre: z.string().max(16, 'Genre is too long').optional().or(z.literal('')),
    tracks: z.array(layoutSchema),
    parts: z.array(layoutSchema),
    scenes: z.array(layoutSchema),
});

type ProjectModalProps = {
    projectId?: number;
    open: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
};

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectModal({
    projectId,
    open,
    onClose,
    onSaveSuccess,
}: ProjectModalProps) {
    const isCreateMode = !projectId;
    const [isEditing, setIsEditing] = useState(isCreateMode);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            genre: '',
            tracks: [],
            parts: [],
            scenes: [],
        },
    });

    const { fields: trackFields } = useFieldArray({ control, name: 'tracks' });
    const { fields: partFields } = useFieldArray({ control, name: 'parts' });
    const { fields: sceneFields } = useFieldArray({ control, name: 'scenes' });

    const { data: project, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await axios.get(`/api/projects/${projectId}`);
            return response.data.data;
        },
        enabled: !!projectId,
    });

    useEffect(() => {
        if (open) {
            if (project && !isCreateMode) {
                reset({
                    title: project.title,
                    genre: project.genre || '',
                    tracks: project.tracks,
                    parts: project.parts,
                    scenes: project.scenes,
                });
            } else if (isCreateMode) {
                reset({
                    title: '',
                    genre: '',
                    tracks: [],
                    parts: [],
                    scenes: [],
                });
            }
        }
    }, [project, isCreateMode, open, reset]);

    const mutation = useMutation({
        mutationFn: (data: ProjectFormData) => {
            if (isCreateMode) {
                return axios.post(`/api/projects`, {
                    title: data.title,
                    genre: data.genre,
                });
            } else {
                return axios.put(`/api/projects/${projectId}`, data);
            }
        },
        onSuccess: () => {
            onSaveSuccess();
            setIsEditing(isCreateMode);
        },
        onError: (error: any) => {
            alert('Something wrong...');
        },
    });

    const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
        mutation.mutate(data);
    };

    const handleCancel = () => {
        if (isCreateMode) {
            onClose();
        } else {
            if (project) {
                reset({
                    title: project.title,
                    genre: project.genre || '',
                    tracks: project.tracks,
                    parts: project.parts,
                    scenes: project.scenes,
                });
            }
            setIsEditing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50" />
                <DialogContent className="fixed left-1/2 -translate-y-1/2 bg-white p-6 shadow-lg dark:bg-black">
                    {isLoading && <div>Loading...</div>}

                    {isEditing && !isLoading && (
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold dark:text-white">
                                    {isCreateMode
                                        ? 'Create New Project'
                                        : 'Edit Project'}
                                </DialogTitle>
                                <DialogDescription>
                                    {isCreateMode
                                        ? 'Fill in the details for your new project.'
                                        : 'Update the project details and labels.'}
                                </DialogDescription>
                            </DialogHeader>

                            <div>
                                <label
                                    htmlFor="title"
                                    className="dark:text-white"
                                >
                                    Project Title
                                </label>
                                <input
                                    id="title"
                                    {...register('title')}
                                    disabled={mutation.isPending}
                                    className="w-full rounded border p-2 dark:bg-black dark:text-white"
                                />
                                {errors.title && (
                                    <p className="text-red-500">
                                        {errors.title.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="genre"
                                    className="dark:text-white"
                                >
                                    Genre (Optional)
                                </label>
                                <input
                                    id="genre"
                                    {...register('genre')}
                                    disabled={mutation.isPending}
                                    className="w-full rounded border p-2 dark:bg-black dark:text-white"
                                />
                                {errors.genre && (
                                    <p className="text-red-500">
                                        {errors.genre.message}
                                    </p>
                                )}
                            </div>

                            {/* Labels in edit mode */}
                            {!isCreateMode && (
                                <>
                                    {/* Track Labels */}
                                    <div>
                                        <h4 className="font-semibold dark:text-white">
                                            Track Labels (1-8)
                                        </h4>
                                        <div className="grid grid-cols-4 gap-2 rounded border p-2">
                                            {trackFields.map((field, index) => (
                                                <div key={field.id}>
                                                    <label className="text-sm dark:text-gray-400">
                                                        {index + 1}
                                                    </label>
                                                    <input
                                                        {...register(
                                                            `tracks.${index}.label`,
                                                        )}
                                                        disabled={
                                                            mutation.isPending
                                                        }
                                                        className="w-full rounded border p-1 dark:bg-black dark:text-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Part Labels */}
                                    <div>
                                        <h4 className="font-semibold dark:text-white">
                                            Part Labels (1-4)
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 rounded border p-2">
                                            {partFields.map((field, index) => (
                                                <div key={field.id}>
                                                    <label className="text-sm dark:text-gray-400">
                                                        {index + 1}
                                                    </label>
                                                    <input
                                                        {...register(
                                                            `parts.${index}.label`,
                                                        )}
                                                        disabled={
                                                            mutation.isPending
                                                        }
                                                        className="w-full rounded border p-1 dark:bg-black dark:text-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Scene Labels */}
                                    <div>
                                        <h4 className="font-semibold dark:text-white">
                                            Scene Labels (1-16)
                                        </h4>
                                        <div className="grid grid-cols-4 gap-2 rounded border p-2">
                                            {sceneFields.map((field, index) => (
                                                <div key={field.id}>
                                                    <label className="text-sm dark:text-gray-400">
                                                        {index + 1}
                                                    </label>
                                                    <input
                                                        {...register(
                                                            `scenes.${index}.label`,
                                                        )}
                                                        disabled={
                                                            mutation.isPending
                                                        }
                                                        className="w-full rounded border p-1 dark:bg-black dark:text-white"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Form buttons */}
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={mutation.isPending}
                                    className="rounded border px-4 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={mutation.isPending}
                                    className="rounded border px-4 py-2 text-white"
                                >
                                    {mutation.isPending ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Expanded project view */}
                    {!isEditing && !isLoading && project && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold dark:text-white">
                                    {project.title}
                                </DialogTitle>
                                <DialogDescription>
                                    Project Details & Labels
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-4 space-y-4">
                                {/* Tracks */}
                                <div>
                                    <h4 className="font-semibold dark:text-white">
                                        Track Labels (1-8)
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2 rounded border p-2">
                                        {project.tracks?.map(
                                            (track: any, i: number) => (
                                                <div
                                                    key={track.id}
                                                    className="text-sm dark:text-gray-300"
                                                >
                                                    <strong>{i + 1}:</strong>{' '}
                                                    {track.label || '...'}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Parts */}
                                <div>
                                    <h4 className="font-semibold dark:text-white">
                                        Part Labels (1-4)
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 rounded border p-2">
                                        {project.parts?.map(
                                            (part: any, i: number) => (
                                                <div
                                                    key={part.id}
                                                    className="text-sm dark:text-gray-300"
                                                >
                                                    <strong>{i + 1}:</strong>{' '}
                                                    {part.label || '...'}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>

                                {/* Scenes */}
                                <div>
                                    <h4 className="font-semibold dark:text-white">
                                        Scene Labels (1-16)
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2 rounded border p-2">
                                        {project.scenes?.map(
                                            (scene: any, i: number) => (
                                                <div
                                                    key={scene.id}
                                                    className="text-sm dark:text-gray-300"
                                                >
                                                    <strong>{i + 1}:</strong>{' '}
                                                    {scene.label || '...'}
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded border px-4 py-2"
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="rounded border px-4 py-2 text-white"
                                >
                                    Edit
                                </button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
