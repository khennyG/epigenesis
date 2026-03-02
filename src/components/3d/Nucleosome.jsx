import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import HistoneOctamer from './HistoneOctamer';
import DNAHelix from './DNAHelix';
import HistoneTails from './HistoneTails';
import ParticleEffects from './ParticleEffects';

// Camera controller for preset views and auto-rotation
function CameraController({ autoRotate, currentView, onViewChange }) {
  const { camera } = useThree();
  const controlsRef = useRef();
  
  // Preset camera positions
  const viewPositions = {
    default: { position: [8, 6, 12], target: [0, 0, 0] },
    front: { position: [0, 0, 15], target: [0, 0, 0] },
    top: { position: [0, 15, 0], target: [0, 0, 0] },
    side: { position: [15, 0, 0], target: [0, 0, 0] },
  };
  
  useEffect(() => {
    if (currentView && viewPositions[currentView]) {
      const { position } = viewPositions[currentView];
      // Animate camera to new position
      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(...position);
      const duration = 1000;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        camera.position.lerpVectors(startPos, endPos, eased);
        camera.lookAt(0, 0, 0);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    }
  }, [currentView, camera]);
  
  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      autoRotate={autoRotate}
      autoRotateSpeed={0.5}
      minDistance={8}
      maxDistance={30}
      enablePan={false}
      target={[0, 0, 0]}
    />
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        color: '#818cf8',
        fontSize: 14,
        fontFamily: "'Sora', sans-serif",
      }}>
        Loading 3D model...
      </div>
    </Html>
  );
}

// Main 3D Scene
function Scene({ 
  modifications, 
  selectedEnzyme, 
  onSiteClick, 
  showLabels, 
  autoRotate, 
  currentView,
  wrappingTightness 
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={0.8} 
        castShadow 
      />
      <directionalLight 
        position={[-10, 10, -10]} 
        intensity={0.3} 
        color="#6366f1"
      />
      <pointLight 
        position={[0, -10, 0]} 
        intensity={0.2} 
        color="#ec4899"
      />
      
      {/* Background */}
      <color attach="background" args={['#050816']} />
      <fog attach="fog" args={['#050816', 20, 50]} />
      <Stars 
        radius={40} 
        depth={50} 
        count={800} 
        factor={3} 
        saturation={0} 
        fade 
        speed={0.3}
      />
      
      {/* Floating particles */}
      <ParticleEffects count={100} />
      
      {/* Main nucleosome structure */}
      <group position={[0, 0, 0]}>
        <HistoneOctamer showLabels={showLabels} />
        <DNAHelix wrappingTightness={wrappingTightness} />
        <HistoneTails 
          modifications={modifications}
          selectedEnzyme={selectedEnzyme}
          onSiteClick={onSiteClick}
          showLabels={showLabels}
        />
      </group>
      
      {/* Camera controls */}
      <CameraController 
        autoRotate={autoRotate} 
        currentView={currentView}
      />
    </>
  );
}

export default function Nucleosome({ 
  modifications = {}, 
  selectedEnzyme = null, 
  onSiteClick,
  showLabels = true,
  autoRotate = true,
  currentView = 'default',
  wrappingTightness = 0.5
}) {
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      maxHeight: '100%',
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
    }}>
      <Canvas
        camera={{ position: [8, 6, 12], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene 
            modifications={modifications}
            selectedEnzyme={selectedEnzyme}
            onSiteClick={onSiteClick}
            showLabels={showLabels}
            autoRotate={autoRotate}
            currentView={currentView}
            wrappingTightness={wrappingTightness}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
