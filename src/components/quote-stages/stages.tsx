import { ShapeStage } from '~/components/quote-stages/shape';
import { MeasurementsStage } from '~/components/quote-stages/measurements';
import { InfillStage } from '~/components/quote-stages/infill';
import { BorderStage } from '~/components/quote-stages/border';
import { ConfigureStage } from '~/components/quote-stages/configure';
import { EmailStage } from './email';

export const stages = [
	{
		id: 'shape',
		displayName: 'Shape',
		component: ShapeStage,
		optional: false
	},
	{
		id: 'measurements',
		displayName: 'Measurements',
		component: MeasurementsStage,
		optional: false
	},
	{
		id: 'infill',
		displayName: 'Infill',
		component: InfillStage,
		optional: true
	},
	{
		id: 'border',
		displayName: 'Border',
		component: BorderStage,
		optional: true
	},
	{ id: 'email', displayName: 'Email', component: EmailStage, optional: false },
	{
		id: 'review',
		displayName: 'Review',
		component: ConfigureStage,
		optional: false
	}
];

export const maximumStageIndex = stages.length - 1;
