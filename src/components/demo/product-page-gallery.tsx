import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls /* , Plane */ } from '@react-three/drei';

type Props = {
	colorID: string;
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

const ProductGallery = ({ colorID }: Props) => {
	return (
		<Canvas frameloop="demand" camera={{ position: [0, 2.5, 0] }}>
			<OrbitControls enablePan={false} />

			<ambientLight />
			<pointLight position={[-2, 2, 2]} intensity={0.5} />
			<pointLight position={[-2, 2, -2]} intensity={1} castShadow />
			{/* <directionalLight
				intensity={0.5}
				castShadow
				shadow-mapSize-height={512}
				shadow-mapSize-width={512}
			/> */}

			<Box castShadow receiveShadow position={[0, 0, 0]} args={[1, 0.5, 2]}>
				<meshStandardMaterial
					attach="material"
					color={'#' + colors[`${colorID.split(':')[1]}`]}
				/>
			</Box>

			{/* <Plane
				receiveShadow
				rotation={[-Math.PI / 2, 0, 0]}
				position={[0, -0.251, 0]}
				args={[10, 10]}
			>
				<meshStandardMaterial attatch="material" color="white" />
			</Plane> */}
		</Canvas>
	);
};

export default ProductGallery;
