import ProjectForm from '@/components/project-form';
import { ProjectFormData, useProjectForm } from '@/hooks/use-project-form';
import { Layout } from '@/types';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { FieldPath, SubmitHandler } from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
} from './ui/dialog';

type ProjectModalProps = {
    projectId: number | null;
    open: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
};

export default function ProjectModal({
    projectId,
    open,
    onClose,
    onSaveSuccess,
}: ProjectModalProps) {
    const { project, isLoadingProject, isCreateMode, formMethods } =
        useProjectForm(projectId);
    const [isEditing, setIsEditing] = useState(isCreateMode);

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
        onError: (error: AxiosError | Error) => {
            if (
                axios.isAxiosError(error) &&
                error.response &&
                error.response.status === 422
            ) {
                const validationErrors = error.response.data.errors as Record<
                    string,
                    string[]
                >;
                Object.keys(validationErrors).forEach((key) => {
                    formMethods.setError(key as FieldPath<ProjectFormData>, {
                        type: 'manual',
                        message: validationErrors[key][0],
                    });
                });
            } else {
                console.error('Error occurred:', error);
                alert('Something wrong...');
            }
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () => {
            return axios.delete(`/api/projects/${projectId}`);
        },
        onSuccess: () => {
            onSaveSuccess();
        },
        onError: (error: AxiosError | unknown) => {
            console.error('Deletion Failed:', error);
            alert('Could not delete project.');
        },
    });

    const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
        mutation.mutate(data);
    };

    const handleDelete = () => {
        if (projectId) {
            deleteMutation.mutate();
        }
    };

    const handleCancel = () => {
        if (isCreateMode) {
            onClose();
        } else {
            if (project) {
                formMethods.reset({
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
                    {isLoadingProject && <div>Loading...</div>}
                    {isEditing && !isLoadingProject && (
                        <ProjectForm
                            formMethods={formMethods}
                            onSubmit={onSubmit}
                            onCancel={handleCancel}
                            isSubmitting={mutation.isPending}
                            isCreateMode={isCreateMode}
                        />
                    )}

                    {!isEditing && !isLoadingProject && project && (
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
                                <div>
                                    <h4 className="font-semibold dark:text-white">
                                        Track Labels (1-8)
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2 rounded border p-2">
                                        {project.tracks?.map(
                                            (track: Layout, i: number) => (
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
                                <div>
                                    <h4 className="font-semibold dark:text-white">
                                        Part Labels (1-4)
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 rounded border p-2">
                                        {project.parts?.map(
                                            (part: Layout, i: number) => (
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
                                <div>
                                    <h4 className="font-semibold dark:text-white">
                                        Scene Labels (1-16)
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2 rounded border p-2">
                                        {project.scenes?.map(
                                            (scene: Layout, i: number) => (
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

                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleteMutation.isPending}
                                    className="rounded border border-red-500/50 px-4 py-2 text-red-500/80 transition hover:bg-red-100 dark:hover:bg-red-900/30"
                                >
                                    {deleteMutation.isPending
                                        ? 'Deleting...'
                                        : 'Delete'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="rounded border px-4 py-2 text-white transition dark:hover:bg-white/10"
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
