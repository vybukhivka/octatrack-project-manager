import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { type ProjectFormData } from '@/hooks/use-project-form';
import {
    FormProvider,
    SubmitHandler,
    useFieldArray,
    useFormContext,
    UseFormReturn,
} from 'react-hook-form';

type ProjectFormInputsProps = {
    onCancel: () => void;
    isSubmitting: boolean;
    isCreateMode: boolean;
};

function ProjectFormInputs({
    onCancel,
    isSubmitting,
    isCreateMode,
}: ProjectFormInputsProps) {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<ProjectFormData>();

    const { fields: trackFields } = useFieldArray({ control, name: 'tracks' });
    const { fields: partFields } = useFieldArray({ control, name: 'parts' });
    const { fields: sceneFields } = useFieldArray({ control, name: 'scenes' });

    const buttonText = isCreateMode ? 'Create Project' : 'Save Changes';

    return (
        <>
            <DialogHeader>
                <DialogTitle className="text-xl font-bold dark:text-white">
                    {isCreateMode ? 'Create New Project' : 'Edit Project'}
                </DialogTitle>
                <DialogDescription>
                    {isCreateMode
                        ? 'Fill in the details for your new project.'
                        : 'Update the project details and labels.'}
                </DialogDescription>
            </DialogHeader>

            <div>
                <label htmlFor="title" className="dark:text-white">
                    Project Title
                </label>
                <input
                    id="title"
                    {...register('title')}
                    disabled={isSubmitting}
                    className="w-full rounded border p-2 dark:bg-black dark:text-white"
                />
                {errors.title && (
                    <p className="text-red-500">{errors.title.message}</p>
                )}
            </div>
            <div>
                <label htmlFor="genre" className="dark:text-white">
                    Genre (Optional)
                </label>
                <input
                    id="genre"
                    {...register('genre')}
                    disabled={isSubmitting}
                    className="w-full rounded border p-2 dark:bg-black dark:text-white"
                />
                {errors.genre && (
                    <p className="text-red-500">{errors.genre.message}</p>
                )}
            </div>

            {!isCreateMode && (
                <>
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
                                        {...register(`tracks.${index}.label`)}
                                        disabled={isSubmitting}
                                        className="w-full rounded border p-1 dark:bg-black dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

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
                                        {...register(`parts.${index}.label`)}
                                        disabled={isSubmitting}
                                        className="w-full rounded border p-1 dark:bg-black dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

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
                                        {...register(`scenes.${index}.label`)}
                                        disabled={isSubmitting}
                                        className="w-full rounded border p-1 dark:bg-black dark:text-white"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className="mt-6 flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="rounded border px-4 py-2"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded border px-4 py-2 text-white"
                >
                    {isSubmitting ? 'Saving...' : buttonText}
                </button>
            </div>
        </>
    );
}

type ProjectFormProps = {
    formMethods: UseFormReturn<ProjectFormData>;
    onSubmit: SubmitHandler<ProjectFormData>;
    onCancel: () => void;
    isSubmitting: boolean;
    isCreateMode: boolean;
};

export default function ProjectForm({
    formMethods,
    onSubmit,
    ...props
}: ProjectFormProps) {
    return (
        <FormProvider {...formMethods}>
            <form
                onSubmit={formMethods.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <ProjectFormInputs {...props} />
            </form>
        </FormProvider>
    );
}
