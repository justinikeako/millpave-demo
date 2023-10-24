import { useFormContext } from 'react-hook-form';
import { StoneProject } from '~/types/quote';
import { useStageContext } from './stage-context';

type StageFormProps = React.ComponentPropsWithoutRef<'form'>;

export function StageForm(props: StageFormProps) {
	const { handleSubmit } = useFormContext<StoneProject>();
	const { commitQueue } = useStageContext();

	return (
		<form {...props} id="stage-form" onSubmit={handleSubmit(commitQueue)}>
			{props.children}
		</form>
	);
}
