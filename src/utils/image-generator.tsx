// Drag this into pages when you need to make renders for models

import { Box3, Group, Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three-stdlib';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import domToImage from 'dom-to-image';
import { Button } from '~/components/button';

async function generateImage(canvas: HTMLCanvasElement) {
	try {
		return await domToImage.toBlob(canvas);
	} catch (error) {
		throw new Error(error as string);
	}
}

type GLTFResult = GLTF & {
	nodes: {
		model: Mesh;
	};
	materials: {
		concrete: MeshStandardMaterial;
	};
};

function Scene({
	skuIds,
	currentModelIndex,
	capturing,
	addCapture,
	nextModel
}: {
	skuIds: string[];
	currentModelIndex: number;
	capturing: boolean;
	addCapture(newCapture: Capture): void;
	nextModel(): void;
}) {
	const files = skuIds.map((skuId) => {
		const slug = skuId.replace(/:/g, '-');
		return {
			slug,
			file: `https://raw.githubusercontent.com/justinikeako/cornerstone-models/main/${slug}.gltf`
		};
	});

	const gltf = useGLTF(
		files.map(({ file }) => file)
	) as unknown as GLTFResult[];
	const { nodes, materials } = gltf[currentModelIndex] as GLTFResult;

	const groupRef = useRef<Group>(null);
	const planeRef = useRef<Mesh>(null);

	const three = useThree();

	useEffect(() => {
		const captureImages = async () => {
			if (capturing && currentModelIndex < files.length) {
				// Set the desired file name for the image
				const fileName = `${files[currentModelIndex]?.slug}.png`;

				// Capture the model on the canvas after a delay to prevent unintended duplicates
				setTimeout(async () => {
					// Render the model on the canvas
					const { gl } = three;

					// Generate and save the image
					const image = await generateImage(gl.domElement);

					addCapture({ image, fileName });

					// Move to the next model
					nextModel();
				}, 50);
			}
		};

		captureImages();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [capturing, currentModelIndex, files.length]);

	return (
		<>
			<ambientLight intensity={0.1} />

			<directionalLight
				castShadow
				position={[-15, 20, -15]}
				intensity={1}
				shadow-mapSize={1024}
				shadow-bias={-0.0001}
			/>
			<pointLight position={[5, 0.1, 5]} intensity={0.3} />

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
		</>
	);
}

type Capture = { fileName: string; image: Blob };

function ProductViewer3D({ skuIds }: { skuIds: string[] }) {
	const [capturing, setCapturing] = useState(false);
	const [captures, setCaptures] = useState<Capture[]>([]);

	const [currentModelIndex, setCurrentModelIndex] = useState(0);

	function cycleModel() {
		const newIndex = currentModelIndex + 1;
		const maxIndex = skuIds.length - 1;
		if (newIndex <= maxIndex) setCurrentModelIndex(newIndex);
		else setCapturing(false);
	}

	function addCapture(newCapture: Capture) {
		setCaptures((prevCapture) => [...prevCapture, newCapture]);
	}

	async function handleDownloadCaptures() {
		if (captures.length === 0) {
			console.error('No images captured.');
			return;
		}

		const zip = new JSZip();

		captures.forEach((captures) => {
			zip.file(captures.fileName, captures.image);
		});

		const blob = await zip.generateAsync({ type: 'blob' });

		saveAs(blob, 'batch_images.zip');
	}

	function handleReset() {
		setCurrentModelIndex(0);
		setCaptures([]);
	}

	return (
		<>
			<div className=" aspect-square w-[512px]">
				<Canvas
					camera={{ position: [0, 4.5, 0], near: 0.01, far: 20, fov: 45 }}
					shadows="soft"
					frameloop="demand"
					gl={{ preserveDrawingBuffer: true }}
				>
					<Scene
						skuIds={skuIds}
						capturing={capturing}
						currentModelIndex={currentModelIndex}
						addCapture={addCapture}
						nextModel={cycleModel}
					/>
				</Canvas>
			</div>

			<div className="flex gap-2">
				<Button
					intent="primary"
					onClick={() => setCapturing(true)}
					disabled={capturing}
				>
					Start Capture
				</Button>
				<Button
					intent="primary"
					onClick={handleDownloadCaptures}
					disabled={!capturing && captures.length === 0}
				>
					Download
				</Button>

				<Button
					intent="primary"
					onClick={handleReset}
					disabled={!capturing && captures.length === 0}
				>
					Reset
				</Button>
			</div>
		</>
	);
}

const colors = [
	'grey',
	'ash',
	'charcoal',
	'slate',
	'spanish_brown',
	'sunset_taupe',
	'tan',
	'shale_brown',
	'sunset_clay',
	'red',
	'charcoal_red',
	'red_yellow',
	'terracotta',
	'orange',
	'sunset_tangerine',
	'yellow',
	'green'
];

export default function Page() {
	return (
		<main className="">
			<ProductViewer3D
				skuIds={colors.flatMap((color) => [
					'cobble_mix:double:' + color,
					'cobble_mix:oblong:' + color,
					'cobble_mix:two_part:' + color
				])}
			/>
		</main>
	);
}
