import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { SKU } from '../types/product';
import LinkButton from './link-button';
import Model from './paver';

type Props = {
	sku: SKU;
};

function ProductGallery({ sku }: Props) {
	const slug = sku.id.replace(/:/g, '-') + '.gltf';

	// Spooky regex. replaces ':' with '+' and separates the product ID
	const [productId, skuId] = sku.id.replace(/:/g, '+').split(/\+(.*)/s); // Not sure how it works 😔

	const file = `https://raw.githubusercontent.com/justinikeako/cornerstone-models/main/${slug}`;
	const mode = 'ar_only';
	const link = `https://beta.millpave.notprimitive.com/product/${productId}?sku=${skuId}`;
	const title = encodeURIComponent(sku.display_name);
	const resizable = false;
	const fallback_url = `https://beta.millpave.notprimitive.com/product/${productId}?sku=${skuId}`;

	return (
		<>
			<div className="flex-1">
				<Canvas
					frameloop="demand"
					camera={{ position: [0, 0.45, 0], near: 0.01, far: 2, fov: 45 }}
				>
					<OrbitControls
						enablePan={false}
						minDistance={0.3}
						maxDistance={0.6}
						minPolarAngle={0}
						maxPolarAngle={Math.PI / 2}
					/>

					<ambientLight />
					<pointLight position={[-2, -2, 2]} intensity={0.5} />
					<pointLight position={[-2, 2, -2]} intensity={1} />

					<Model file={file} />
				</Canvas>
			</div>
			<div className="flex flex-col items-center">
				<LinkButton
					variant="secondary"
					href={`intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=${mode}&title=${title}&link=${link}&resizable=${resizable}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${fallback_url};end;`}
					iconLeft="view_in_ar_new"
				>
					View in Your Space
				</LinkButton>
			</div>
		</>
	);
}

export default ProductGallery;
