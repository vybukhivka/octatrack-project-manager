import { Project } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useProjects() {
    return useQuery<Project[]>({
        queryKey: ['projects'],
        queryFn: async () => {
            try {
                const response = await axios.get('/api/projects');
                return response.data.data;
            } catch (err) {
                console.error('Error fetching projects:', err);
                if (axios.isAxiosError(err)) {
                    console.error(
                        'Error details:',
                        err.response?.status,
                        err.response?.data,
                    );
                }
                throw err;
            }
        },
    });
}
