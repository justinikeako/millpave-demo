'use client';

import { Canvas } from '@react-three/fiber';
import { LumaSplatsSemantics } from '@lumaai/luma-web';
import '~/utils/luma-splats';
import { CineonToneMapping } from 'three';
import { Grid, OrbitControls, PivotControls } from '@react-three/drei';

const gridConfig = {
	gridSize: [12, 12],
	cellThickness: 1,
	cellColor: '#0001',
	sectionColor: '#0001',
	fadeDistance: 25,
	fadeStrength: 1,
	followCamera: false,
	infiniteGrid: true
};

function Page() {
	return (
		<div className="h-svh">
			<Canvas
				gl={{
					antialias: false,
					toneMapping: CineonToneMapping
				}}
			>
				{/* <Grid
					position={[0, -1, 0]}
					args={[10.5, 10.5]}
					{...gridConfig}
					renderOrder={-1}
				/> */}

				<ambientLight intensity={1} />

				<mesh
					position={[0, -0.2, 0]}
					rotation={[0.01 - Math.PI / 2, 0.01, 0.225]}
					receiveShadow
				>
					<planeGeometry attach="geometry" args={[1.55, 1.55]} />
					<meshStandardMaterial attach="material" color="#707080" />
				</mesh>

				<lumaSplats
					semanticsMask={LumaSplatsSemantics.ALL}
					source="https://lumalabs.ai/capture/d913de89-45ac-40ba-a29e-19b847932b8f"
					position={[0, 0, 0]}
					scale={0.5}
					rotation={[0, Math.PI, 0]}
				/>

				<OrbitControls
					enablePan={false}
					// minPolarAngle={0}
					// maxPolarAngle={Math.PI / 2}
				/>
			</Canvas>
		</div>
	);
}

export default Page;
