'use client';

import { Canvas } from '@react-three/fiber';
import { LumaSplatsSemantics } from '@lumaai/luma-web';
import '~/utils/luma-splats';
import { CineonToneMapping, RepeatWrapping } from 'three';
import { OrbitControls, useTexture } from '@react-three/drei';
import { useState } from 'react';
import { cn } from '~/lib/utils';
import { OrchestratedReveal } from '~/components/reveal';

function Scene({ color }: { color: string }) {
	const normalMap = useTexture('/normal-map.webp');

	return (
		<>
			<ambientLight intensity={1} />

			<directionalLight castShadow position={[-15, 20, -5]} intensity={2} />

			<mesh
				position={[0, -0.19125, 0]}
				rotation={[0.01 - Math.PI / 2, 0.01, 0.225]}
				receiveShadow
			>
				<planeGeometry attach="geometry" args={[1.55, 1.55]} />
				<meshStandardMaterial
					attach="material"
					color={color}
					normalMap={normalMap}
					normalMap-repeat={3}
					normalMap-wrapS={RepeatWrapping}
					normalMap-wrapT={RepeatWrapping}
				/>
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
				minPolarAngle={0.3}
				maxPolarAngle={Math.PI / 2 - 0.15}
			/>
		</>
	);
}

function Page() {
	const colors = {
		grey: { displayName: 'Grey', hex: '#787c82' },
		ash: { displayName: 'Ash', hex: '#65696e' },
		charcoal: { displayName: 'Charcoal', hex: '#4b4e52' },
		red: { displayName: 'Red', hex: '#805953' },
		terracotta: { displayName: 'Terracotta', hex: '#8c5d51' },
		orange: { displayName: 'Orange', hex: '#916b5a' },
		yellow: { displayName: 'Yellow', hex: '#87825d' },
		green: { displayName: 'Green', hex: '#6c7a66' },
		spanish_brown: { displayName: 'Spanish Brown', hex: '#706059' },
		shale_brown: { displayName: 'Shale Brown', hex: '#735d5e' }
	};

	const [selectedColorId, setSelectedColorId] =
		useState<keyof typeof colors>('red');
	const selectedColor = colors[selectedColorId];

	return (
		<div className="h-svh" data-header-transparent>
			<Canvas
				gl={{
					antialias: false,
					toneMapping: CineonToneMapping,
					pixelRatio: 0.75
				}}
				camera={{ position: [0.2, 0.15, 1.3] }}
			>
				<Scene color={selectedColor.hex} />
			</Canvas>

			<div className="absolute bottom-4 w-full space-y-2 px-4">
				<OrchestratedReveal asChild delay={0.1}>
					<p className="mx-auto w-fit rounded-full bg-black/75 px-2 py-1 text-center text-white/75 shadow-md ring-1 ring-black/10 backdrop-blur-md">
						Selected Color: {selectedColor.displayName}
					</p>
				</OrchestratedReveal>

				<OrchestratedReveal asChild delay={0.2}>
					<ul className="no-scrollbar mx-auto flex w-fit max-w-full gap-1 overflow-auto rounded-full bg-black/75 px-1.5 py-1 shadow-md ring-1 ring-black/10 backdrop-blur-md">
						{Object.entries(colors).map(([colorId, { hex }]) => (
							<li key={colorId} className="contents">
								<button
									className={cn(
										'size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-inset ring-black/50 before:block before:size-full before:bg-gradient-to-b before:from-white/75 before:mix-blend-overlay',
										colorId === selectedColorId &&
											'ring-0 ring-offset-2 ring-offset-white'
									)}
									style={{ backgroundColor: hex }}
									onClick={() =>
										setSelectedColorId(colorId as keyof typeof colors)
									}
								/>
							</li>
						))}
					</ul>
				</OrchestratedReveal>
			</div>
		</div>
	);
}

export default Page;
