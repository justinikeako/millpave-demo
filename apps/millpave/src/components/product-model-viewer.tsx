import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { SKU } from '../types/product';
import LinkButton from './link-button';
import { useGLTF } from '@react-three/drei';
import { GLTF, USDZExporter } from 'three-stdlib';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

type GLTFResult = GLTF & {
	nodes: {
		model: THREE.Mesh;
	};
	materials: {
		concrete: THREE.MeshStandardMaterial;
	};
};

type iOSARLinkProps = {
	scene: THREE.Group | undefined;
	title: string;
	callToAction: string;
};

function IOSARLink({ scene, ...props }: iOSARLinkProps) {
	const router = useRouter();
	const [blobLink, setBlobLink] = useState<string>();

	const encoded = {
		title: encodeURIComponent(props.title),
		callToAction: encodeURIComponent(props.callToAction)
	};

	useEffect(() => {
		async function generateAndSetBlobLink() {
			if (scene) {
				const exporter = new USDZExporter();

				const arrayBuffer = await exporter.parse(scene);
				const blob = new Blob([arrayBuffer], {
					type: 'application/octet-stream'
				});
				const generatedBlobLink = URL.createObjectURL(blob);

				setBlobLink(generatedBlobLink);
			}
		}

		generateAndSetBlobLink();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scene?.id]);

	const linkButtonRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		function handleBannerClick(event: Event) {
			const eventWithData = event as unknown as { data: string };

			if (eventWithData.data === '_apple_ar_quicklook_button_tapped') {
				router.push('/quote');
			}
		}

		const linkButton = linkButtonRef.current;

		linkButton?.addEventListener('message', handleBannerClick, false);

		return () => linkButton?.removeEventListener('message', handleBannerClick);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<LinkButton
			ref={linkButtonRef}
			variant="secondary"
			iconLeft="view_in_ar_new"
			id="link"
			rel="ar"
			download="asset.usdz"
			href={`${blobLink}#checkoutTitle=${encoded.title}&callToAction=${encoded.callToAction}&customHeight=small`}
		>
			{/* eslint-disable-next-line jsx-a11y/alt-text */}
			<img />
			View in Your Space
		</LinkButton>
	);
}

type AndroidARLinkProps = {
	title: string;
	link: string;
	file: string;
};

function AndroidARLink({ file, title, link }: AndroidARLinkProps) {
	const mode = 'ar_only';
	const resizable = false;
	const encodedTitle = encodeURIComponent(title);
	const fallback_url = `https://millpave.notprimitive.com/no-ar`;

	return (
		<LinkButton
			variant="secondary"
			iconLeft="view_in_ar_new"
			href={`intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=${mode}&title=${encodedTitle}&link=${link}&resizable=${resizable}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${fallback_url};end;`}
		>
			View in Your Space
		</LinkButton>
	);
}

type ModelProps = {
	file: string;
	onSceneChange: (scene: THREE.Group) => void;
};

function Model({ file, onSceneChange }: ModelProps) {
	const { nodes, materials, scene } = useGLTF(file) as unknown as GLTFResult;

	useEffect(() => {
		onSceneChange(scene);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scene.id]);

	return (
		<group dispose={null}>
			{Object.entries(nodes).map(([, { id, geometry, position }]) => (
				<mesh
					key={id}
					geometry={geometry}
					material={materials.concrete}
					position={position}
				/>
			))}
		</group>
	);
}

const getMobileDetect = (userAgent: NavigatorID['userAgent']) => {
	const isAndroid = () => Boolean(userAgent.match(/Android/i));
	const isIos = () => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
	const isOpera = () => Boolean(userAgent.match(/Opera Mini/i));
	const isWindows = () => Boolean(userAgent.match(/IEMobile/i));
	const isSSR = () => Boolean(userAgent.match(/SSR/i));
	const isMobile = () =>
		Boolean(isAndroid() || isIos() || isOpera() || isWindows());
	const isDesktop = () => Boolean(!isMobile() && !isSSR());
	return {
		isMobile,
		isDesktop,
		isAndroid,
		isIos,
		isSSR
	};
};

const useMobileDetect = () => {
	const userAgent =
		typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent;

	return getMobileDetect(userAgent);
};

type ProductViewerProps = {
	sku: SKU;
};

function ProductViewer({ sku }: ProductViewerProps) {
	const slug = sku.id.replace(/:/g, '-') + '.gltf';

	// Spooky regex. replaces ':' with '+' and separates the product ID
	const [productId, skuId] = sku.id.replace(/:/g, '+').split(/\+(.*)/s); // Not sure how it works 😔
	const link = `https://beta.millpave.notprimitive.com/product/${productId}?sku=${skuId}`;
	const title = sku.display_name;
	const file = `https://raw.githubusercontent.com/justinikeako/cornerstone-models/main/${slug}`;

	const { isIos, isAndroid } = useMobileDetect();
	const [scene, setScene] = useState<THREE.Group>();

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

					<Model file={file} onSceneChange={(scene) => setScene(scene)} />
				</Canvas>
			</div>
			<div className="flex flex-col items-center">
				{isAndroid() && <AndroidARLink file={file} title={title} link={link} />}

				{isIos() && (
					<IOSARLink scene={scene} title={title} callToAction="Get a Quote" />
				)}
			</div>
		</>
	);
}

export default ProductViewer;
