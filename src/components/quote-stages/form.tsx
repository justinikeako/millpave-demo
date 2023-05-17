import { FormProvider, useForm } from 'react-hook-form';
import { useStageContext } from '../stage-context';
import { StoneProject } from '@/types/quote';

type StageFormProps = Omit<
	React.ComponentPropsWithoutRef<'form'>,
	'onSubmit'
> & {
	onSubmit?(newValues: StoneProject): void;
};

export function StageForm({ onSubmit, ...props }: StageFormProps) {
	const { values, setValues, commitQueuedIndex } = useStageContext();
	const formMethods = useForm<StoneProject>({
		defaultValues: values
	});

	const { handleSubmit } = formMethods;

	function saveData(newValues: StoneProject) {
		setValues({ ...values, ...newValues });

		if (onSubmit) onSubmit({ ...values, ...newValues });

		commitQueuedIndex();
	}

	return (
		<FormProvider {...formMethods}>
			<form {...props} id="stage-form" onSubmit={handleSubmit(saveData)}>
				{props.children}
			</form>
		</FormProvider>
	);
}
