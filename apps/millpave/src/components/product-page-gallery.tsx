import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { SKU } from '../types/product';
import LinkButton from './link-button';

type Props = {
	colorId: string;
	sku: SKU;
};

const Model = dynamic(() => import('./paver'), {
	suspense: true
});

function ProductGallery({ colorId, sku }: Props) {
	const slug = sku.id.replace(/:/g, '-') + '.gltf';

	const ARLink = new URL('intent://arvr.google.com/scene-viewer/1.0');
	ARLink.searchParams.append(
		'file',
		`https://beta.millpave.notprimitive.com/models/${slug}.gltf`
	);
	ARLink.searchParams.append('mode', 'ar_only');
	ARLink.searchParams.append(
		'link',
		`https://beta.millpave.notprimitive.com/product?sku=${colorId}`
	);
	ARLink.searchParams.append('title', sku.display_name);
	ARLink.searchParams.append('resizable', 'false');
	ARLink.hash = `Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://beta.millpave.notprimitive.com/product?sku=${colorId};end;`;

	return (
		<>
			<div className="flex-1">
				<Canvas frameloop="demand" camera={{ position: [0, 0.2, 0] }}>
					<OrbitControls enablePan={false} />
					<ambientLight />
					<pointLight position={[-2, 2, 2]} intensity={0.5} />
					<pointLight position={[-2, 2, -2]} intensity={1} castShadow />

					<Suspense fallback={null}>
						<Model slug={slug} />
					</Suspense>
				</Canvas>
			</div>
			<div className="flex flex-col items-center">
				<LinkButton
					variant="secondary"
					href={ARLink.href}
					iconLeft="view_in_ar_new"
				>
					View in Your Space
				</LinkButton>
			</div>
		</>
	);
}

export default ProductGallery;
