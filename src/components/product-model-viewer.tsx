'use client';

import type { Group, Mesh, MeshStandardMaterial } from 'three';
import { Box3 } from 'three';
import { type GLTF, USDZExporter } from 'three-stdlib';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { useMobileDetect } from '../utils/use-mobile-detect';
import QRCode from 'react-qr-code';

type GLTFResult = GLTF & {
	nodes: {
		model: Mesh;
	};
	materials: {
		concrete: MeshStandardMaterial;
	};
};

type ProductViewer3DProps = {
	skuId: string;
	displayName: string;
};

function ProductViewer3D({ skuId, displayName }: ProductViewer3DProps) {
	const slug = skuId.replace(/:/g, '-') + '.gltf';

	const [productId, ...variantIdFragments] = skuId.split(':');
	const variantId = variantIdFragments.join(':');
	const link = `${
		window.location.origin
	}/product/${productId}?sku=${encodeURIComponent(variantId)}&image=3`;
	const title = displayName;
	const file = `https://raw.githubusercontent.com/justinikeako/cornerstone-models/main/${slug}`;

	const { isIos, isAndroid, isDesktop } = useMobileDetect();
	const { nodes, materials, scene } = useGLTF(file) as unknown as GLTFResult;
	const groupRef = useRef<Group>(null);
	const planeRef = useRef<Mesh>(null);

	return (
		<>
			<div className="absolute inset-0">
				<Canvas
					camera={{ position: [0, 4.5, 0], near: 0.01, far: 20, fov: 45 }}
					shadows="soft"
					frameloop="demand"
				>
					<OrbitControls
						enablePan={false}
						minDistance={2}
						maxDistance={7.5}
						minPolarAngle={0}
						maxPolarAngle={Math.PI / 2}
					/>

					<ambientLight intensity={0.1} />

					<directionalLight
						castShadow
						position={[-15, 20, -15]}
						intensity={3}
						shadow-mapSize={1024}
						shadow-bias={-0.0001}
					/>
					<directionalLight position={[5, 0.1, 5]} intensity={1} />

					<group ref={groupRef} scale={[10, 10, 10]}>
						{Object.entries(nodes).map(([, { id, geometry, position }]) => (
							<mesh
								key={id}
								geometry={geometry}
								material={materials.concrete}
								position={position}
								castShadow
								receiveShadow
								onAfterRender={() => {
									if (!groupRef.current || !planeRef.current) return;

									const box = new Box3().setFromObject(groupRef.current);
									const height = box.max.y - box.min.y;

									planeRef.current.position.y = -height / 2 - 0.01;
								}}
							/>
						))}
					</group>

					<mesh
						receiveShadow
						position={[0, 0, 0]}
						rotation={[-Math.PI / 2, 0, 0]}
						ref={planeRef}
					>
						<planeGeometry attach="geometry" args={[100, 100]} />
						<shadowMaterial attach="material" opacity={0.5} />
					</mesh>
				</Canvas>
			</div>

			<div className="absolute bottom-4 right-4">
				{isDesktop() && <DesktopARPrompt link={link} />}
				{isAndroid() && <AndroidARLink file={file} title={title} link={link} />}

				{isIos() && (
					<IOSARLink scene={scene} title={title} callToAction="Get a Quote" />
				)}
			</div>
		</>
	);
}

type DesktopARPromptProps = {
	link: string;
};

function DesktopARPrompt({ link }: DesktopARPromptProps) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<div className="flex flex-col items-end justify-end space-y-2">
				{open && (
					<div className="space-y-2 rounded-lg bg-white p-4 shadow-button">
						<QRCode
							className="h-48 w-48"
							bgColor="transparent"
							fgColor="rgb(24 24 27)"
							value={link}
						/>
						<p className="w-48 text-center">
							Scan this code using your phone&apos;s camera
						</p>
					</div>
				)}

				<Button intent="secondary" onClick={() => setOpen(!open)}>
					View in Your Space
				</Button>
			</div>
		</>
	);
}

type IOSARLinkProps = {
	scene: Group | undefined;
	title: string;
	callToAction: string;
};

function IOSARLink({ scene, ...props }: IOSARLinkProps) {
	const router = useRouter();
	const [blobLink, setBlobLink] = useState<string>();

	const encoded = {
		title: encodeURIComponent(props.title),
		subtitle: encodeURIComponent(
			'Note: All colors are based on the brochures.'
		),
		callToAction: encodeURIComponent(props.callToAction)
	};

	// This feels bad as an effect, but idk how to get it to work if I don't use one :(
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

		generateAndSetBlobLink().catch(() => 'AR link generation failed.');

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [scene?.id]);

	const linkButtonRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		function handleBannerClick(event: Event) {
			const eventWithData = event as unknown as { data: string };

			if (eventWithData.data === '_apple_ar_quicklook_button_tapped') {
				router.push('/contact?form=quote');
			}
		}

		const linkButton = linkButtonRef.current;

		linkButton?.addEventListener('message', handleBannerClick, false);

		return () => linkButton?.removeEventListener('message', handleBannerClick);
	}, [router]);

	return (
		<Button asChild intent="secondary" className="relative">
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
		<Button intent="secondary" asChild>
			<a
				href={`intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=${mode}&title=${encodedTitle}&link=${link}&resizable=${resizable}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${fallback_url};end;`}
			>
				<span className="font-semibold">View in Your Space</span>
			</a>
		</Button>
	);
}

export { ProductViewer3D };
