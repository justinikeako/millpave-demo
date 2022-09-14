import * as THREE from 'three';
import React from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
	nodes: {
		model: THREE.Mesh;
	};
	materials: {
		concrete: THREE.MeshStandardMaterial;
	};
};

type ModelProps = JSX.IntrinsicElements['group'] & {
	slug: string;
};

function Model({ slug, ...props }: ModelProps) {
	const { nodes, materials } = useGLTF(
		`/models/${slug}`
	) as unknown as GLTFResult;

	return (
		<group {...props} dispose={null}>
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

export default Model;
