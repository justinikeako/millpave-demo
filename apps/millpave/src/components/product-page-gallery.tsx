import { Canvas } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import Button from './button';

type Props = {
	colorId: string;
};

const colors: { [key: string]: string } = {
	grey: 'D9D9D9',
	ash: 'B1B1B1',
	charcoal: '696969',
	spanish_brown: '95816D',
	sunset_taupe: 'C9B098',
	tan: 'DDCCBB',
	shale_brown: '907A7A',
	sunset_clay: 'E7A597',
	red: 'EF847A',
	terracotta: 'EFA17A',
	orange: 'EBB075',
	sunset_tangerine: 'E7C769',
	yellow: 'E7DD69',
	green: 'A9D786'
};

function ProductGallery({ colorId }: Props) {
	return (
		<>
			<div className="flex-1">
				<Canvas frameloop="demand" camera={{ position: [0, 2.5, 0] }}>
					<ambientLight />
					<pointLight position={[-2, 2, 2]} intensity={0.5} />
					<pointLight position={[-2, 2, -2]} intensity={1} castShadow />

					<Box castShadow receiveShadow position={[0, 0, 0]} args={[1, 0.5, 2]}>
						<meshStandardMaterial
							attach="material"
							color={'#' + colors[colorId]}
						/>
					</Box>
				</Canvas>
			</div>
			<div className="flex flex-col items-center">
				<Button variant="secondary" iconLeft="view_in_ar_new">
					View in Your Space
				</Button>
			</div>
		</>
	);
}

export default ProductGallery;
