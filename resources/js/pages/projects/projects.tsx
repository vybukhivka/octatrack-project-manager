import ProjectModal from '@/components/project-modal';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useProjects } from '@/hooks/use-projects';
import AppLayout from '@/layouts/app-layout';
import { projects as projectsRoute } from '@/routes';
import { Project, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Projects',
        href: projectsRoute().url,
    },
];
axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export default function Projects() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
        null,
    );
    const queryClient = useQueryClient();
    const { data: projects, isLoading, isError } = useProjects();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Projects" />
            <Button
                onClick={() => {
                    setSelectedProjectId(null);
                    setIsModalOpen(true);
                }}
                size="sm"
                variant="ghost"
                className="mt-4 ml-4 w-48 cursor-pointer border"
            >
                + Create New Project
            </Button>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {isLoading && <div>Loading...</div>}
                    {isError && <div>Error fetching data.</div>}
                    {projects &&
                        projects.map((project: Project) => (
                            <div
                                key={project.id}
                                onClick={() => {
                                    setSelectedProjectId(project.id);
                                    setIsModalOpen(true);
                                }}
                                className="relative flex aspect-video cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-4 shadow-sm dark:border-sidebar-border"
                            >
                                <div className="mb-3 flex justify-between">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                                        <span>{project.title}</span>
                                    </h3>
                                    <span
                                        className={`relative top-3 inline-block h-1 w-1 rounded-full ${
                                            project.is_done
                                                ? 'bg-green-500'
                                                : 'bg-red-500'
                                        } `}
                                    ></span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flext justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Genre:{' '}
                                        </span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {project.genre}
                                        </span>
                                    </div>
                                    <div className="flext justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Tracks:{' '}
                                        </span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {project.number_of_tracks}
                                        </span>
                                    </div>
                                    <div className="flext justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">
                                            Duration:{' '}
                                        </span>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">
                                            {project.duration_minutes}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {isModalOpen && (
                        <ProjectModal
                            projectId={selectedProjectId}
                            open={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onSaveSuccess={() => {
                                setIsModalOpen(false);
                                setSelectedProjectId(null);
                                queryClient.invalidateQueries({
                                    queryKey: ['projects'],
                                });
                            }}
                        />
                    )}
                </div>
                <div className="min-h- relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
