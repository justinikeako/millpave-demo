import { Canvas, useFrame } from '@react-three/fiber';
import { SKU } from '../types/product';
import { useGLTF } from '@react-three/drei';
import { GLTF, USDZExporter } from 'three-stdlib';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from './button';
import Icon from './icon';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';

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
		subtitle: encodeURIComponent(
			'Note: This model is an approximation based on the brochures.'
		),
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
				router.push('/quote/create');
			}
		}

		const linkButton = linkButtonRef.current;

		linkButton?.addEventListener('message', handleBannerClick, false);

		return () => linkButton?.removeEventListener('message', handleBannerClick);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Button asChild variant="secondary" className="relative">
			<div>
				<a
					ref={linkButtonRef}
					href={`${blobLink}#allowsContentScaling=0&canonicalWebPageURL=https://millpave.com/&callToAction=${encoded.callToAction}&checkoutTitle=${encoded.title}&checkoutSubtitle=${encoded.subtitle}`}
					rel="ar"
					className="absolute inset-0"
					download="asset.usdz"
				>
					{/* eslint-disable-next-line jsx-a11y/alt-text */}
					<img />
				</a>
				<Icon name="view_in_ar_new" />
				<span className="font-semibold">View in Your Space</span>
			</div>
		</Button>
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
		<Button variant="secondary" asChild>
			<a
				href={`intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=${mode}&title=${encodedTitle}&link=${link}&resizable=${resizable}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${fallback_url};end;`}
			>
				<Icon name="view_in_ar_new" />
				<span className="font-semibold">View in Your Space</span>
			</a>
		</Button>
	);
}

type ModelProps = {
	file: string;
	onSceneChange?: (scene: THREE.Group) => void;
};

function Model({ file, onSceneChange }: ModelProps) {
	const { nodes, materials, scene } = useGLTF(file) as unknown as GLTFResult;

	useEffect(() => {
		if (onSceneChange) onSceneChange(scene);

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

function degreesToRadians(degrees: number) {
	return (degrees * Math.PI) / 180;
}

type SceneProps = ModelProps & {
	scrollProgress: MotionValue<number>;
};

const Scene = ({ file, scrollProgress, onSceneChange }: SceneProps) => {
	const yAngle = useTransform(
		scrollProgress,
		[0, 0.333, 0.666, 1],
		[
			degreesToRadians(0),
			degreesToRadians(65),
			degreesToRadians(90),
			degreesToRadians(90)
		]
	);
	const xAngle = useTransform(
		scrollProgress,
		[0, 0.333, 0.666, 1],
		[0, degreesToRadians(45), degreesToRadians(90), degreesToRadians(180)]
	);

	const distance = useTransform(
		scrollProgress,
		[0, 0.333, 0.666, 1],
		[0.5, 0.45, 0.45, 0.45]
	);

	useFrame(({ camera }) => {
		camera.position.setFromSphericalCoords(
			distance.get(),
			yAngle.get(),
			xAngle.get()
		);

		camera.updateProjectionMatrix();
		camera.lookAt(0, 0, 0);
	});

	return (
		<>
			<ambientLight />
			<pointLight position={[-2, -2, 2]} intensity={0.5} />
			<pointLight position={[-2, 2, -2]} intensity={1} />

			<Model file={file} onSceneChange={onSceneChange} />
		</>
	);
};

type SlideIndicatorProps = {
	scrollProgress: MotionValue<number>;
};

type DotProps = {
	scrollProgress: MotionValue<number>;
	index: number;
};

const Dot = ({ index: dotIndex, scrollProgress }: DotProps) => {
	const inputArray = [0, 0.333, 0.666, 1];

	const scaleArray = inputArray.map((_, index) => {
		if (dotIndex === index) return 1;
		else if (Math.abs(dotIndex - index) === 1) return 0.75;
		else return 0.5;
	});

	const opacityArray = inputArray.map((_, index) => {
		if (dotIndex === index) return 1;
		else if (Math.abs(dotIndex - index) === 1) return 0.5;
		else return 0.25;
	});

	const scale = useTransform(scrollProgress, [0, 0.333, 0.666, 1], scaleArray);

	const opacity = useTransform(scrollProgress, inputArray, opacityArray);

	return (
		<motion.div
			className="h-2 w-2 rounded-full bg-zinc-400"
			style={{ scale, opacity }}
		/>
	);
};
const SlideIndicator = ({ scrollProgress }: SlideIndicatorProps) => {
	return (
		<div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 -translate-y-1/2 space-x-1">
			<Dot index={0} scrollProgress={scrollProgress} />
			<Dot index={1} scrollProgress={scrollProgress} />
			<Dot index={2} scrollProgress={scrollProgress} />
			<Dot index={3} scrollProgress={scrollProgress} />
		</div>
	);
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

	const containerRef = useRef<HTMLDivElement>(null);

	const { scrollXProgress } = useScroll({
		container: containerRef
	});

	return (
		<>
			<div className="flex-1">
				<div
					ref={containerRef}
					className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-scroll"
				>
					<div className="sticky left-0 h-full w-screen shrink-0 snap-center">
						<Canvas camera={{ near: 0.01, far: 2, fov: 45 }}>
							<Scene
								scrollProgress={scrollXProgress}
								file={file}
								onSceneChange={(scene) => setScene(scene)}
							/>
						</Canvas>
						<SlideIndicator scrollProgress={scrollXProgress} />
					</div>
					<div className="z-10 h-full w-screen shrink-0 snap-center"></div>
					<div className="z-10 h-full w-screen shrink-0 snap-center"></div>
					<div className="z-10 h-full w-screen shrink-0 snap-center"></div>
					{/* <div className="z-10 h-full w-screen shrink-0 snap-center border-b-2 border-blue-500"></div> */}
				</div>
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
