import { Button } from '@/components/button';
import { StageForm } from './form';
import { StoneEditor } from './stone-editor';

export function InfillStage() {
	return (
		<StageForm className="space-y-16 px-32">
			<h2 className="text-center text-2xl">Add an infill.</h2>

			<StoneEditor name="infill" dimension="3D" />

			<Button variant="primary" type="submit">
				Next
			</Button>
		</StageForm>
	);
}
