import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

// Modification site colors
const MODIFICATION_COLORS = {
  acetylation: '#22c55e',
  methylation_activate: '#3b82f6', // Bright blue for activating
  methylation_silence: '#dc2626', // Deep crimson for silencing
  phosphorylation: '#eab308',
  unmodified: '#9ca3af',
};

// H3 and H4 tail modification sites per the spec
const TAIL_SITES = {
  H3: [
    { id: 'H3K4', label: 'H3K4', residue: 'Lysine 4', position: 1, canAcetylate: false, canMethylate: true, methylEffect: 'activate', description: 'Activating methylation site' },
    { id: 'H3K9', label: 'H3K9', residue: 'Lysine 9', position: 2, canAcetylate: true, canMethylate: true, methylEffect: 'silence', description: 'Silencing methylation site' },
    { id: 'H3K27', label: 'H3K27', residue: 'Lysine 27', position: 3, canAcetylate: true, canMethylate: true, methylEffect: 'silence', description: 'Polycomb silencing mark' },
    { id: 'H3K36', label: 'H3K36', residue: 'Lysine 36', position: 4, canAcetylate: false, canMethylate: true, methylEffect: 'activate', description: 'Marks active gene bodies' },
  ],
  H4: [
    { id: 'H4K5', label: 'H4K5', residue: 'Lysine 5', position: 1, canAcetylate: true, canMethylate: false, description: 'Acetylation loosens chromatin' },
    { id: 'H4K8', label: 'H4K8', residue: 'Lysine 8', position: 2, canAcetylate: true, canMethylate: false, description: 'Promotes gene activation' },
    { id: 'H4K12', label: 'H4K12', residue: 'Lysine 12', position: 3, canAcetylate: true, canMethylate: false, description: 'Target for acetylation' },
    { id: 'H4K16', label: 'H4K16', residue: 'Lysine 16', position: 4, canAcetylate: true, canMethylate: false, description: 'Critical for chromatin decompaction' },
  ],
};

// Individual modification site sphere
function ModificationSite({ 
  position, 
  site, 
  modification, 
  selectedEnzyme, 
  onSiteClick, 
  showLabels,
  tailIndex 
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  const color = modification 
    ? MODIFICATION_COLORS[modification.type] 
    : MODIFICATION_COLORS.unmodified;
  
  const isModified = !!modification;
  
  // Check if current enzyme can be applied
  const canApply = useMemo(() => {
    if (!selectedEnzyme) return false;
    switch (selectedEnzyme.action) {
      case 'acetylate': return site.canAcetylate && !modification;
      case 'methylate_activate': return site.canMethylate && site.methylEffect === 'activate' && !modification;
      case 'methylate_silence': return site.canMethylate && site.methylEffect === 'silence' && !modification;
      case 'phosphorylate': return site.canPhosphorylate && !modification;
      case 'deacetylate': return modification?.type === 'acetylation';
      case 'demethylate': return modification?.type?.startsWith('methylation');
      case 'dephosphorylate': return modification?.type === 'phosphorylation';
      default: return false;
    }
  }, [selectedEnzyme, modification, site]);
  
  // Pulsing animation for unmodified sites
  useFrame((state) => {
    if (meshRef.current) {
      const baseScale = isModified ? 1.1 : 1;
      const pulse = isModified 
        ? Math.sin(state.clock.elapsedTime * 3) * 0.1 
        : Math.sin(state.clock.elapsedTime * 2) * 0.15;
      meshRef.current.scale.setScalar(baseScale + pulse);
    }
  });
  
  const handleClick = (e) => {
    e.stopPropagation();
    if (onSiteClick) {
      onSiteClick(site, tailIndex);
    }
  };
  
  return (
    <group position={position}>
      {/* Outer glow ring for valid targets */}
      {canApply && selectedEnzyme && (
        <mesh>
          <ringGeometry args={[0.2, 0.28, 32]} />
          <meshBasicMaterial
            color={selectedEnzyme.color}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
      
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = selectedEnzyme ? (canApply ? 'crosshair' : 'not-allowed') : 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.3}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={isModified ? 0.5 : (hovered ? 0.3 : 0.1)}
          clearcoat={0.4}
        />
      </mesh>
      
      {/* Tooltip on hover */}
      {hovered && showLabels && (
        <Html center position={[0, 0.5, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(15, 19, 51, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 8,
            padding: '10px 14px',
            minWidth: 160,
            fontFamily: "'JetBrains Mono', monospace",
          }}>
            <div style={{ color: color, fontWeight: 700, fontSize: 12 }}>{site.label}</div>
            <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 2 }}>{site.residue}</div>
            <div style={{ color: '#64748b', fontSize: 9, marginTop: 4 }}>{site.description}</div>
            <div style={{ 
              marginTop: 6, 
              padding: '4px 8px', 
              borderRadius: 4,
              background: isModified ? `${color}20` : 'rgba(156, 163, 175, 0.1)',
              color: isModified ? color : '#94a3b8',
              fontSize: 9,
              fontWeight: 500,
            }}>
              {isModified ? `Modified: ${modification.type.replace('_', ' ')}` : 'Unmodified'}
            </div>
            {selectedEnzyme && (
              <div style={{ 
                marginTop: 4, 
                fontSize: 9, 
                color: canApply ? '#22c55e' : '#ef4444' 
              }}>
                {canApply ? `Click to apply ${selectedEnzyme.name}` : `Cannot apply ${selectedEnzyme.name} here`}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

// Single histone tail - chain of spheres with modification sites
function HistoneTail({ 
  basePosition, 
  direction, 
  type, 
  sites, 
  modifications, 
  selectedEnzyme, 
  onSiteClick,
  showLabels,
  tailIndex,
  tailColor
}) {
  const groupRef = useRef();
  const chainLength = 8; // Number of amino acid spheres in the chain
  const spacing = 0.25;
  
  // Swaying animation for the tail
  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        if (child.type === 'Mesh' || child.type === 'Group') {
          // Amplifying sway toward the tip
          const swayAmount = (i + 1) * 0.02;
          const originalX = direction[0] * spacing * i;
          const originalY = direction[1] * spacing * i;
          const originalZ = direction[2] * spacing * i;
          
          child.position.x = basePosition[0] + originalX + Math.sin(time * 1.5 + i * 0.3) * swayAmount;
          child.position.y = basePosition[1] + originalY + Math.cos(time * 1.2 + i * 0.4) * swayAmount * 0.5;
          child.position.z = basePosition[2] + originalZ + Math.sin(time * 1.8 + i * 0.2) * swayAmount;
        }
      });
    }
  });
  
  // Generate chain elements
  const chainElements = useMemo(() => {
    const elements = [];
    
    for (let i = 0; i < chainLength; i++) {
      const pos = [
        basePosition[0] + direction[0] * spacing * i,
        basePosition[1] + direction[1] * spacing * i,
        basePosition[2] + direction[2] * spacing * i,
      ];
      
      // Check if this position is a modification site
      const site = sites.find(s => s.position === i + 1);
      
      elements.push({
        position: pos,
        isSite: !!site,
        site,
        size: site ? 0.15 : 0.08 - i * 0.003, // Sites are larger, chain gets smaller toward tip
      });
    }
    
    return elements;
  }, [basePosition, direction, sites, chainLength, spacing]);
  
  return (
    <group ref={groupRef}>
      {chainElements.map((elem, idx) => (
        elem.isSite ? (
          <ModificationSite
            key={elem.site.id}
            position={elem.position}
            site={elem.site}
            modification={modifications[elem.site.id]}
            selectedEnzyme={selectedEnzyme}
            onSiteClick={onSiteClick}
            showLabels={showLabels}
            tailIndex={tailIndex}
          />
        ) : (
          <mesh key={idx} position={elem.position}>
            <sphereGeometry args={[elem.size, 12, 12]} />
            <meshPhysicalMaterial
              color={tailColor}
              metalness={0.1}
              roughness={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        )
      ))}
      
      {/* Tail label */}
      {showLabels && (
        <Html 
          center 
          position={[
            basePosition[0] + direction[0] * spacing * (chainLength + 1),
            basePosition[1] + direction[1] * spacing * (chainLength + 1) + 0.3,
            basePosition[2] + direction[2] * spacing * (chainLength + 1),
          ]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{ 
            color: '#94a3b8', 
            fontSize: 10, 
            fontFamily: "'JetBrains Mono', monospace",
            whiteSpace: 'nowrap',
          }}>
            {type} Tail
          </div>
        </Html>
      )}
    </group>
  );
}

export default function HistoneTails({ 
  modifications = {}, 
  selectedEnzyme = null, 
  onSiteClick,
  showLabels = true 
}) {
  // Define the 4 tails - 2 H3 tails and 2 H4 tails extending from the octamer
  const tails = useMemo(() => [
    // H3 tail 1 - extending outward upper left
    {
      basePosition: [1.8, 0.8, 0],
      direction: [1, 0.3, 0],
      type: 'H3',
      sites: TAIL_SITES.H3,
      tailColor: '#8b6cc1',
      tailIndex: 0,
    },
    // H3 tail 2 - opposite side
    {
      basePosition: [-1.8, 0.8, 0],
      direction: [-1, 0.3, 0],
      type: 'H3',
      sites: [], // Second H3 tail - visual only, no interactive sites
      tailColor: '#8b6cc1',
      tailIndex: 1,
    },
    // H4 tail 1 - extending outward
    {
      basePosition: [0, 0.8, 1.8],
      direction: [0, 0.3, 1],
      type: 'H4',
      sites: TAIL_SITES.H4,
      tailColor: '#5cb85c',
      tailIndex: 2,
    },
    // H4 tail 2 - opposite side
    {
      basePosition: [0, 0.8, -1.8],
      direction: [0, 0.3, -1],
      type: 'H4',
      sites: [], // Second H4 tail - visual only
      tailColor: '#5cb85c',
      tailIndex: 3,
    },
  ], []);
  
  return (
    <group>
      {tails.map((tail, idx) => (
        <HistoneTail
          key={idx}
          basePosition={tail.basePosition}
          direction={tail.direction}
          type={tail.type}
          sites={tail.sites}
          modifications={modifications}
          selectedEnzyme={selectedEnzyme}
          onSiteClick={onSiteClick}
          showLabels={showLabels}
          tailIndex={tail.tailIndex}
          tailColor={tail.tailColor}
        />
      ))}
    </group>
  );
}
