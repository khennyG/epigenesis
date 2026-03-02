import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { generateHelixPoints, createCurveFromPoints } from '../../utils/helixMath';

// DNA strand component using TubeGeometry
function DNAStrand({ points, color, emissiveIntensity = 0.15 }) {
  const geometry = useMemo(() => {
    const curve = createCurveFromPoints(points);
    return new THREE.TubeGeometry(curve, 150, 0.15, 8, false);
  }, [points]);
  
  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.2}
        roughness={0.3}
        clearcoat={0.5}
        clearcoatRoughness={0.3}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Base pair rungs connecting the two strands
function BasePairs({ strand1Points, strand2Points, interval = 12 }) {
  const rungs = useMemo(() => {
    const result = [];
    
    for (let i = 0; i < strand1Points.length - 1; i += interval) {
      const p1 = strand1Points[i];
      const p2 = strand2Points[i];
      const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const length = p1.distanceTo(p2);
      
      // Calculate rotation to align cylinder with direction
      const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
      const quaternion = new THREE.Quaternion();
      quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      
      result.push({
        position: [midpoint.x, midpoint.y, midpoint.z],
        quaternion: quaternion.clone(),
        length,
        key: i,
      });
    }
    
    return result;
  }, [strand1Points, strand2Points, interval]);
  
  return (
    <group>
      {rungs.map((rung) => (
        <mesh
          key={rung.key}
          position={rung.position}
          quaternion={rung.quaternion}
        >
          <cylinderGeometry args={[0.03, 0.03, rung.length * 0.85, 6]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.35}
            metalness={0.2}
            roughness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function DNAHelix({ wrappingTightness = 0.5 }) {
  const groupRef = useRef();
  
  // Generate helix points based on wrapping tightness
  // wrappingTightness: 0 = loose (gene active), 1 = tight (gene silenced)
  const { strand1, strand2 } = useMemo(() => {
    return generateHelixPoints(wrappingTightness, 1.7, 200);
  }, [wrappingTightness]);
  
  // Subtle rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Strand 1 - Gold */}
      <DNAStrand 
        points={strand1} 
        color="#d4a843" 
        emissiveIntensity={0.2}
      />
      
      {/* Strand 2 - Amber (slightly darker) */}
      <DNAStrand 
        points={strand2} 
        color="#c4943a" 
        emissiveIntensity={0.15}
      />
      
      {/* Base pair rungs */}
      <BasePairs strand1Points={strand1} strand2Points={strand2} interval={10} />
    </group>
  );
}
