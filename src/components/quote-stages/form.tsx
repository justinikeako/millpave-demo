import { FormProvider, useForm } from 'react-hook-form';
import { FormValues, useStageContext } from '../stage-context';

type StageFormProps = Omit<
	React.ComponentPropsWithoutRef<'form'>,
	'onSubmit'
> & {
	onSubmit?(newValues: FormValues): void;
};

export function StageForm({ onSubmit, ...props }: StageFormProps) {
	const { values, setValues, incrementCurrentStageIndex } = useStageContext();
	const formMethods = useForm<FormValues>({
		defaultValues: values
	});

	const { handleSubmit } = formMethods;

	function saveData(newValues: FormValues) {
		setValues({ ...values, ...newValues });

		if (onSubmit) onSubmit({ ...values, ...newValues });

		incrementCurrentStageIndex();
	}

	return (
		<FormProvider {...formMethods}>
			<form {...props} onSubmit={handleSubmit(saveData)} className="contents">
				{props.children}
			</form>
		</FormProvider>
	);
}
