import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls /* , Plane */ } from '@react-three/drei';

const ProductGallery = () => {
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
				<meshStandardMaterial attach="material" color="yellow" />
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
