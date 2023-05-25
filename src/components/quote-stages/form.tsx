import { useFormContext } from 'react-hook-form';
import { StoneProject } from '@/types/quote';
import { useStageContext } from './stage-context';

type StageFormProps = Omit<
	React.ComponentPropsWithoutRef<'form'>,
	'onSubmit'
> & {
	onSubmit?(newValues: StoneProject): void;
};

export function StageForm({ onSubmit, ...props }: StageFormProps) {
	const { handleSubmit } = useFormContext<StoneProject>();
	const { commitQueuedIndex } = useStageContext();

	return (
		<form
			{...props}
			id="stage-form"
			onSubmit={handleSubmit((values) => {
				if (onSubmit) onSubmit(values);

				commitQueuedIndex();
			})}
		>
			{props.children}
		</form>
	);
}
