import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LinkButton from './link-button';

type Props = {
	colorId: string;
};

const Model = dynamic(() => import('./paver'), {
	suspense: true
});

function ProductGallery({ colorId }: Props) {
	return (
		<>
			<div className="flex-1">
				<Canvas frameloop="demand" camera={{ position: [0, 0.2, 0] }}>
					<OrbitControls enablePan={false} />
					<ambientLight />
					<pointLight position={[-2, 2, 2]} intensity={0.5} />
					<pointLight position={[-2, 2, -2]} intensity={1} castShadow />

					<Suspense fallback={null}>
						<Model color={colorId} />
					</Suspense>
				</Canvas>
			</div>
			<div className="flex flex-col items-center">
				<LinkButton
					variant="secondary"
					href={`intent://arvr.google.com/scene-viewer/1.0?file=https://beta.millpave.notprimitive.com/models/colonial_classic-${colorId}.gltf&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
					iconLeft="view_in_ar_new"
				>
					View in Your Space
				</LinkButton>
			</div>
		</>
	);
}

export default ProductGallery;
