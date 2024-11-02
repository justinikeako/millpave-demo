export const stages = [
	{
		pathname: '/quote-studio',

		displayName: 'Introduction',
		hidden: true
	},
	{
		pathname: '/quote-studio/shape',
		displayName: 'Shape'
	},
	{
		pathname: '/quote-studio/measurements',
		displayName: 'Measurements'
	},
	{
		pathname: '/quote-studio/infill',
		displayName: 'Infill',
		optional: true
	},
	{
		pathname: '/quote-studio/border',
		displayName: 'Border',
		optional: true
	},
	{
		pathname: '/quote-studio/contact-info',
		displayName: 'Contact Info',
		hidden: true
	},
	{
		pathname: '/quote-studio/configure',
		displayName: 'Configure'
	}
];

export const maximumStageIndex = stages.length - 1;
