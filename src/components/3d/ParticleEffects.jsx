import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleEffects({ count = 150 }) {
  const meshRef = useRef();
  
  // Generate random particle positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 15 + Math.random() * 25;
      
      temp.push({
        position: new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ),
        speed: 0.002 + Math.random() * 0.005,
        offset: Math.random() * Math.PI * 2,
        size: 0.03 + Math.random() * 0.05,
      });
    }
    return temp;
  }, [count]);
  
  // Create instanced positions
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Animate particles
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    particles.forEach((particle, i) => {
      // Float animation
      const y = particle.position.y + Math.sin(time * particle.speed * 100 + particle.offset) * 0.5;
      const x = particle.position.x + Math.cos(time * particle.speed * 50 + particle.offset) * 0.3;
      const z = particle.position.z + Math.sin(time * particle.speed * 70 + particle.offset) * 0.3;
      
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(particle.size * (1 + Math.sin(time * 2 + particle.offset) * 0.3));
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial
        color="#6366f1"
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
