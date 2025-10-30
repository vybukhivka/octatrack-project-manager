import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
    projectId: number;
    open: boolean;
    onClose: () => void;
};

export default function ProjectModal({
    projectId,
    open,
    onClose,
}: ProjectModalProps) {
    const { data: project, isLoading } = useQuery({
        queryKey: ['project', projectId],
        queryFn: async () => {
            const response = await axios.get(`/api/projects/${projectId}`);
            return response.data.data;
        },
        enabled: !!projectId,
    });

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50" />
                <DialogContent className="fixed left-1/2 -translate-y-1/2 bg-white p-6 shadow-lg dark:bg-black">
                    {isLoading && <div>Loading...</div>}
                    {project && (
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
                                    <div className="grid grid-cols-4 gap-2 rounded border p-2 dark:border-gray-700">
                                        {project.tracks?.map((track, i) => (
                                            <div
                                                key={track.id}
                                                className="text-sm dark:text-gray-300"
                                            >
                                                <strong>{i + 1}:</strong>{' '}
                                                {track.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Parts */}
                                <div>
                                    <h4 className="font-semibold dark:text-white">
                                        Part Labels (1-4)
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 rounded border p-2 dark:border-gray-700">
                                        {project.parts?.map((part, i) => (
                                            <div
                                                key={part.id}
                                                className="text-sm dark:text-gray-300"
                                            >
                                                <strong>{i + 1}:</strong>{' '}
                                                {part.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Scenes */}
                                <div>
                                    <h4 className="font-semibold dark:text-white">
                                        Scene Labels (1-16)
                                    </h4>
                                    <div className="grid grid-cols-4 gap-2 rounded border p-2 dark:border-gray-700">
                                        {project.scenes?.map((scene, i) => (
                                            <div
                                                key={scene.id}
                                                className="text-sm dark:text-gray-300"
                                            >
                                                <strong>{i + 1}:</strong>{' '}
                                                {scene.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
