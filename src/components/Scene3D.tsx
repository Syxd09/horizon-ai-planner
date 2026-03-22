import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Torus, Box, Icosahedron } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingOrb({ position, color, speed = 1, size = 1 }: { position: [number, number, number]; color: string; speed?: number; size?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.3;
      ref.current.rotation.y += 0.005 * speed;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5}>
      <Sphere ref={ref} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial color={color} roughness={0.2} metalness={0.8} distort={0.3} speed={2} />
      </Sphere>
    </Float>
  );
}

function FloatingRing({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * speed * 0.15) * 0.5;
    }
  });

  return (
    <Float speed={speed * 0.8} rotationIntensity={0.6} floatIntensity={1}>
      <Torus ref={ref} args={[1, 0.15, 16, 48]} position={position}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
      </Torus>
    </Float>
  );
}

function FloatingCube({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * speed * 0.15;
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed * 0.6} rotationIntensity={0.8} floatIntensity={0.8}>
      <Box ref={ref} args={[0.8, 0.8, 0.8]} position={position}>
        <meshStandardMaterial color={color} roughness={0.15} metalness={0.95} wireframe />
      </Box>
    </Float>
  );
}

function FloatingGem({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.2) * 0.4;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[0.7, 0]} position={position}>
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.9} flatShading />
      </Icosahedron>
    </Float>
  );
}

function Particles() {
  const count = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#e8634a" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function Scene3D({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#e8634a" />
        <pointLight position={[-5, -3, 3]} intensity={0.6} color="#2bb5a0" />
        <pointLight position={[0, 5, -5]} intensity={0.4} color="#8b5cf6" />

        <FloatingOrb position={[-3, 1.5, -2]} color="#e8634a" speed={0.8} size={0.9} />
        <FloatingOrb position={[3.5, -1, -3]} color="#2bb5a0" speed={1.2} size={0.6} />
        <FloatingOrb position={[0, 3, -4]} color="#8b5cf6" speed={0.6} size={0.5} />
        
        <FloatingRing position={[-2, -2, -1]} color="#e8634a" speed={0.7} />
        <FloatingRing position={[4, 2, -3]} color="#2bb5a0" speed={0.9} />
        
        <FloatingCube position={[2, -1.5, -2]} color="#e8634a" speed={1} />
        <FloatingCube position={[-4, 0, -4]} color="#8b5cf6" speed={0.5} />
        
        <FloatingGem position={[1, 2.5, -1]} color="#2bb5a0" speed={0.8} />
        <FloatingGem position={[-1.5, -3, -3]} color="#e8634a" speed={1.1} />

        <Particles />
      </Canvas>
    </div>
  );
}
