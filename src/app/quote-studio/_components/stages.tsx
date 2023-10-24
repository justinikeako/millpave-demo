import { ShapeStage } from '~/app/quote-studio/_stages/shape';
import { MeasurementsStage } from '~/app/quote-studio/measurements';
import { InfillStage } from '~/app/quote-studio/infill';
import { BorderStage } from '~/app/quote-studio/_stages/border';
import { ConfigureStage } from '~/app/quote-studio/_stages/configure';
import { EmailStage } from '../_stages/email';

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
	{
		id: 'email',
		displayName: 'Email',
		component: EmailStage,
		optional: false
	},
	{
		id: 'review',
		displayName: 'Review',
		component: ConfigureStage,
		optional: false
	}
];

export const maximumStageIndex = stages.length - 1;
