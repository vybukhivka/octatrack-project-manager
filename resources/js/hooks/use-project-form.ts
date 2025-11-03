import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';

const layoutSchema = z.object({
    id: z.number(),
    label: z.string().max(32, 'Label is too long').optional().or(z.literal('')),
});

export const projectSchema = z.object({
    title: z.string().min(1, 'Title is required').max(32, 'Title is too long'),
    genre: z.string().max(16, 'Genre is too long').optional().or(z.literal('')),
    tracks: z.array(layoutSchema),
    parts: z.array(layoutSchema),
    scenes: z.array(layoutSchema),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export function useProjectForm(projectId: number | null) {
    const isCreateMode = !projectId;

    const { data: project, isLoading: isLoadingProject } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await axios.get(`/api/projects/${projectId}`);
            return response.data.data;
        },
        enabled: !isCreateMode,
    });

    const formMethods = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: '',
            genre: '',
            tracks: [],
            parts: [],
            scenes: [],
        },
    });

    const { fields: trackFields } = useFieldArray({
        control: formMethods.control,
        name: 'tracks',
    });
    const { fields: partFields } = useFieldArray({
        control: formMethods.control,
        name: 'parts',
    });
    const { fields: sceneFields } = useFieldArray({
        control: formMethods.control,
        name: 'scenes',
    });

    useEffect(() => {
        if (project && !isCreateMode) {
            formMethods.reset({
                title: project.title,
                genre: project.genre || '',
                tracks: project.tracks,
                parts: project.parts,
                scenes: project.scenes,
            });
        } else if (isCreateMode) {
            formMethods.reset({
                title: '',
                genre: '',
                tracks: [],
                parts: [],
                scenes: [],
            });
        }
    }, [project, isCreateMode, formMethods.reset, formMethods]);

    return {
        formMethods,
        project,
        isLoadingProject,
        isCreateMode,
        fieldArrays: {
            trackFields,
            partFields,
            sceneFields,
        },
    };
}
