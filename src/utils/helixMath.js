import * as THREE from 'three';

/**
 * Generate points for a DNA helix wrapping around the histone octamer
 * @param {number} wrappingTightness - 0 (loose/active) to 1 (tight/silenced)
 * @param {number} wraps - Number of times DNA wraps around (~1.7)
 * @param {number} segments - Number of points to generate
 * @returns {Object} - Two arrays of Vector3 points for the two strands
 */
export function generateHelixPoints(wrappingTightness = 0.5, wraps = 1.7, segments = 200) {
  const points1 = [];
  const points2 = [];
  
  // Base radius varies with tightness (tighter = closer to core)
  // wrappingTightness: 0 = loose (larger radius), 1 = tight (smaller radius)
  const baseRadius = 3.5;
  const radiusVariation = 1.5;
  const radius = baseRadius + (1 - wrappingTightness) * radiusVariation;
  
  // Vertical pitch (height per wrap)
  const totalHeight = 4.0;
  
  // Helix offset between the two strands (creates double helix)
  const strandOffset = 0.35;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * wraps * Math.PI * 2;
    const y = (t - 0.5) * totalHeight;
    
    // Add some organic variation
    const wobble = Math.sin(angle * 3) * 0.08;
    const currentRadius = radius + wobble;
    
    // Strand 1
    const x1 = Math.cos(angle) * currentRadius;
    const z1 = Math.sin(angle) * currentRadius;
    points1.push(new THREE.Vector3(x1, y, z1));
    
    // Strand 2 (offset in angle for double helix effect)
    const x2 = Math.cos(angle + strandOffset) * currentRadius;
    const z2 = Math.sin(angle + strandOffset) * currentRadius;
    points2.push(new THREE.Vector3(x2, y, z2));
  }
  
  return { strand1: points1, strand2: points2 };
}

/**
 * Create a smooth curve from points
 * @param {Array} points - Array of Vector3 points
 * @returns {THREE.CatmullRomCurve3}
 */
export function createCurveFromPoints(points) {
  return new THREE.CatmullRomCurve3(points);
}

/**
 * Calculate positions for base pair rungs between strands
 * @param {Array} strand1Points 
 * @param {Array} strand2Points 
 * @param {number} interval - How often to place rungs
 * @returns {Array} - Array of rung data
 */
export function calculateBasePairPositions(strand1Points, strand2Points, interval = 10) {
  const rungs = [];
  
  for (let i = 0; i < strand1Points.length; i += interval) {
    const p1 = strand1Points[i];
    const p2 = strand2Points[i];
    const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const direction = new THREE.Vector3().subVectors(p2, p1).normalize();
    const length = p1.distanceTo(p2);
    
    rungs.push({
      start: p1.clone(),
      end: p2.clone(),
      midpoint,
      direction,
      length,
    });
  }
  
  return rungs;
}
