import {
  useGLTF,
  Text,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import React from "react";
import { useThree } from "@react-three/fiber";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

interface GLTFResult extends GLTF {
  nodes: {
    Scene: {
      children: THREE.Mesh[];
    };
  };
}

interface MeshProps {
  data: THREE.Mesh;
}

const Model: React.FC = () => {
  const { viewport } = useThree();
  const { nodes } = useGLTF("/3d/shards.glb") as unknown as GLTFResult;

  return (
    <group scale={viewport.width / 1.5}>
      {nodes.Scene.children.map((mesh, i) => (
        <Mesh data={mesh} key={i} />
      ))}
      <Font />
    </group>
  );
};

const Font: React.FC = () => {
  const src = "/fonts/PPNeueMontreal-Regular.ttf";
  const textOption = {
    color: "white",
    anchorX: "center" as "center",
    anchorY: "middle" as "middle",
  };

  return (
    <group>
      <Text font={src} position={[0, 0, -0.1]} fontSize={0.4} {...textOption}>
        404
      </Text>
      <Text
        font={src}
        position={[0, -0.18, -0.1]}
        fontSize={0.03}
        {...textOption}>
        The link is broken
      </Text>
    </group>
  );
};

const Mesh: React.FC<MeshProps> = ({ data }) => {
  const materialProps = {
    thickness: 0.275,
    ior: 1.8,
    chromaticAberration: 0.75,
    resolution: 300,
  };

  return (
    <Float>
      <mesh {...data}>
        <MeshTransmissionMaterial
          roughness={0}
          transmission={0.99}
          {...materialProps}
        />
      </mesh>
    </Float>
  );
};

export default Model;
