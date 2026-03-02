import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Histone subunit configuration matching the spec
const HISTONE_CONFIG = {
  H2A: { color: '#4a90d9', name: 'Histone H2A', description: 'Core histone protein' },
  H2B: { color: '#45b7a0', name: 'Histone H2B', description: 'Core histone protein' },
  H3: { color: '#8b6cc1', name: 'Histone H3', description: 'Histone with important regulatory tail' },
  H4: { color: '#5cb85c', name: 'Histone H4', description: 'Histone with important regulatory tail' },
};

// Individual histone subunit sphere
function HistoneSubunit({ position, type, index, showLabels }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const config = HISTONE_CONFIG[type];
  
  // Subtle breathing animation
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5 + index * 0.5) * 0.02;
      meshRef.current.scale.setScalar(scale);
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <sphereGeometry args={[0.9, 32, 32]} />
      <meshPhysicalMaterial
        color={config.color}
        metalness={0.1}
        roughness={0.4}
        transparent
        opacity={hovered ? 0.9 : 0.75}
        clearcoat={0.3}
        clearcoatRoughness={0.4}
        emissive={config.color}
        emissiveIntensity={hovered ? 0.3 : 0.1}
      />
      
      {/* Tooltip on hover */}
      {hovered && (
        <Html center position={[0, 1.5, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15, 19, 51, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 8,
            padding: '8px 12px',
            whiteSpace: 'nowrap',
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <div style={{ color: config.color, fontWeight: 600, fontSize: 12 }}>{config.name}</div>
            <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 2 }}>{config.description}</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

export default function HistoneOctamer({ showLabels = true }) {
  const groupRef = useRef();
  
  // Subtle floating animation for the whole octamer
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  
  // Calculate positions for 8 histone subunits in a barrel arrangement
  // 2 layers of 4 subunits each, arranged in alternating pattern
  const subunits = useMemo(() => {
    const result = [];
    const radius = 1.4;
    
    // Layer 1 (top) - H2A, H2B, H3, H4
    const layer1Types = ['H2A', 'H2B', 'H3', 'H4'];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      result.push({
        position: [Math.cos(angle) * radius, 0.6, Math.sin(angle) * radius],
        type: layer1Types[i],
        index: i,
      });
    }
    
    // Layer 2 (bottom) - H2A, H2B, H3, H4 (offset by 45 degrees)
    const layer2Types = ['H2A', 'H2B', 'H3', 'H4'];
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2; // Offset from layer 1
      result.push({
        position: [Math.cos(angle) * radius, -0.6, Math.sin(angle) * radius],
        type: layer2Types[i],
        index: i + 4,
      });
    }
    
    return result;
  }, []);
  
  return (
    <group ref={groupRef}>
      {/* Central core cylinder (semi-transparent) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 1.6, 32]} />
        <meshPhysicalMaterial
          color="#6366f1"
          metalness={0.1}
          roughness={0.5}
          transparent
          opacity={0.25}
          clearcoat={0.2}
        />
      </mesh>
      
      {/* Individual histone subunits */}
      {subunits.map((subunit, idx) => (
        <HistoneSubunit
          key={idx}
          position={subunit.position}
          type={subunit.type}
          index={subunit.index}
          showLabels={showLabels}
        />
      ))}
      
      {/* Center label */}
      {showLabels && (
        <Html center position={[0, 2.5, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15, 19, 51, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: 10,
            padding: '10px 16px',
            textAlign: 'center',
            fontFamily: "'Sora', sans-serif",
          }}>
            <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>Histone Octamer</div>
            <div style={{ color: '#64748b', fontSize: 10, marginTop: 2 }}>8 proteins forming the core</div>
          </div>
        </Html>
      )}
    </group>
  );
}
