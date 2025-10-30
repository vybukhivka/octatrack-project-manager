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
        queryKey: ['project', 'projectId'],
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
                                <DialogDescription>check</DialogDescription>
                            </DialogHeader>
                        </>
                    )}
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
