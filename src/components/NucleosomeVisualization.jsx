import { useState, useEffect } from 'react';
import { useSimulationStore, calcExpressionScore } from '../store/useSimulationStore';
import MODIFICATION_SITES from '../data/modifications';

// Generate DNA helix path
function generateHelixPath(offset, radius, turns, looseness, rotation) {
  const points = [];
  const totalAngle = turns * Math.PI * 2;
  for (let i = 0; i <= 200; i++) {
    const t = i / 200;
    const angle = totalAngle * t + offset;
    const r = radius * looseness;
    const x = 400 + Math.cos(angle + rotation * Math.PI / 180 * 0.3) * r * (0.6 + 0.4 * Math.sin(t * Math.PI));
    const y = 180 + t * 340 - 80 * Math.sin(angle * 0.5);
    points.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return points.join(" ");
}

// Tail configurations
const tailConfigs = [
  { histone: "H3", side: "left", baseX: 240, baseY: 280, angle: -140, sites: MODIFICATION_SITES.H3 },
  { histone: "H3", side: "right", baseX: 560, baseY: 280, angle: -40, sites: MODIFICATION_SITES.H3 },
  { histone: "H4", side: "left", baseX: 270, baseY: 380, angle: -160, sites: MODIFICATION_SITES.H4 },
  { histone: "H4", side: "right", baseX: 530, baseY: 380, angle: -20, sites: MODIFICATION_SITES.H4 },
];

export default function NucleosomeVisualization({ onSiteClick }) {
  const [rotation, setRotation] = useState(0);
  
  const modifications = useSimulationStore((state) => state.modifications);
  const selectedEnzyme = useSimulationStore((state) => state.selectedEnzyme);
  const hoveredSite = useSimulationStore((state) => state.hoveredSite);
  const setHoveredSite = useSimulationStore((state) => state.setHoveredSite);
  const canApplyEnzyme = useSimulationStore((state) => state.canApplyEnzyme);
  
  const score = calcExpressionScore(modifications);
  
  // Slow auto-rotation
  useEffect(() => {
    let frame;
    const animate = () => {
      setRotation((r) => (r + 0.15) % 360);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // DNA looseness based on expression
  const dnaLooseness = ((score + 100) / 200) * 0.4 + 0.8;
  const dnaOpacity = 0.7 + (score + 100) / 400;

  const getSiteColor = (siteId) => {
    const mod = modifications[siteId];
    if (!mod) return null;
    if (mod.type === "acetylation") return "#22c55e";
    if (mod.type === "methylation_activate") return "#f59e0b";
    if (mod.type === "methylation_silence") return "#ef4444";
    if (mod.type === "phosphorylation") return "#eab308";
    return null;
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 800 600" style={{ width: "100%", maxWidth: 800, height: "auto", filter: "drop-shadow(0 0 40px rgba(99, 102, 241, 0.15))" }}>
        <defs>
          {/* Histone core gradient */}
          <radialGradient id="histoneGrad" cx="50%" cy="45%">
            <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0.5" />
          </radialGradient>
          {/* Glow filter for modifications */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glowStrong">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Particle burst filter */}
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          {/* Background gradient */}
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0a0e27" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Subtle background glow */}
        <rect width="800" height="600" fill="url(#bgGrad)" />

        {/* Floating cellular particles */}
        {Array.from({ length: 20 }, (_, i) => {
          const px = (i * 127 + rotation * 0.5) % 800;
          const py = (i * 89 + rotation * 0.3) % 600;
          return (
            <circle key={`p${i}`} cx={px} cy={py} r={1} fill="#6366f1" opacity={0.2 + (i % 3) * 0.1}>
              <animate attributeName="opacity" values={`${0.1 + (i % 3) * 0.1};${0.3 + (i % 2) * 0.1};${0.1 + (i % 3) * 0.1}`} dur={`${3 + i % 4}s`} repeatCount="indefinite" />
            </circle>
          );
        })}

        {/* DNA Helix - Strand 1 (Coral) */}
        <path
          d={generateHelixPath(0, 160, 1.7, dnaLooseness, rotation)}
          fill="none"
          stroke="#f97066"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={dnaOpacity}
          style={{ transition: "all 0.8s ease" }}
        />
        {/* DNA Helix - Strand 2 (Teal) */}
        <path
          d={generateHelixPath(Math.PI, 160, 1.7, dnaLooseness, rotation)}
          fill="none"
          stroke="#2dd4bf"
          strokeWidth={6}
          strokeLinecap="round"
          opacity={dnaOpacity}
          style={{ transition: "all 0.8s ease" }}
        />

        {/* Connector rungs between strands */}
        {Array.from({ length: 12 }, (_, i) => {
          const t = (i + 0.5) / 12;
          const angle1 = 1.7 * Math.PI * 2 * t + rotation * Math.PI / 180 * 0.3;
          const angle2 = angle1 + Math.PI;
          const r = 160 * dnaLooseness * (0.6 + 0.4 * Math.sin(t * Math.PI));
          const x1 = 400 + Math.cos(angle1) * r;
          const y1 = 180 + t * 340 - 80 * Math.sin(angle1 * 0.5);
          const x2 = 400 + Math.cos(angle2) * r;
          const y2 = 180 + t * 340 - 80 * Math.sin(angle2 * 0.5);
          return <line key={`rung${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth={1.5} opacity={0.2} />;
        })}

        {/* Histone Octamer - main barrel */}
        <ellipse cx={400} cy={340} rx={110} ry={75} fill="url(#histoneGrad)" stroke="#818cf8" strokeWidth={1.5} opacity={0.85}>
          <animate attributeName="rx" values="110;112;110" dur="4s" repeatCount="indefinite" />
          <animate attributeName="ry" values="75;77;75" dur="4s" repeatCount="indefinite" />
        </ellipse>
        {/* Inner structure suggestion */}
        <ellipse cx={385} cy={325} rx={35} ry={25} fill="#818cf8" opacity={0.2} />
        <ellipse cx={415} cy={355} rx={30} ry={22} fill="#a78bfa" opacity={0.15} />
        <ellipse cx={400} cy={340} rx={60} ry={40} fill="none" stroke="#c4b5fd" strokeWidth={0.5} opacity={0.3} strokeDasharray="4,4" />

        {/* Histone label */}
        <text x={400} y={340} textAnchor="middle" fill="#e2e8f0" fontSize={13} fontFamily="'JetBrains Mono', monospace" fontWeight="600" opacity={0.8}>
          Histone Octamer
        </text>
        <text x={400} y={356} textAnchor="middle" fill="#94a3b8" fontSize={9} fontFamily="'JetBrains Mono', monospace" opacity={0.6}>
          H2A · H2B · H3 · H4 (×2 each)
        </text>

        {/* Histone Tails */}
        {tailConfigs.map((tail, ti) => {
          const angleRad = (tail.angle * Math.PI) / 180;
          const spacing = 22;

          return (
            <g key={`tail-${ti}`}>
              {/* Tail backbone line */}
              <line
                x1={tail.baseX}
                y1={tail.baseY}
                x2={tail.baseX + Math.cos(angleRad) * spacing * (tail.sites.length + 1)}
                y2={tail.baseY + Math.sin(angleRad) * spacing * (tail.sites.length + 1)}
                stroke="#6366f1"
                strokeWidth={2}
                opacity={0.3}
                strokeDasharray="3,3"
              />

              {/* Tail label */}
              <text
                x={tail.baseX + Math.cos(angleRad) * spacing * (tail.sites.length + 2.5)}
                y={tail.baseY + Math.sin(angleRad) * spacing * (tail.sites.length + 2.5)}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={10}
                fontFamily="'JetBrains Mono', monospace"
              >
                {tail.histone} Tail
              </text>

              {/* Residue spheres */}
              {tail.sites.map((site, si) => {
                const cx = tail.baseX + Math.cos(angleRad) * spacing * (si + 1);
                const cy = tail.baseY + Math.sin(angleRad) * spacing * (si + 1);
                const modColor = getSiteColor(site.id);
                const isHovered = hoveredSite === `${ti}-${site.id}`;
                const canApply = canApplyEnzyme(site, selectedEnzyme);
                const isModified = !!modColor;
                const baseRadius = 9;
                const radius = isHovered ? baseRadius + 3 : baseRadius;

                return (
                  <g
                    key={site.id + ti}
                    style={{ cursor: selectedEnzyme ? (canApply ? "crosshair" : "not-allowed") : "pointer", transition: "transform 0.2s" }}
                    onMouseEnter={() => setHoveredSite(`${ti}-${site.id}`)}
                    onMouseLeave={() => setHoveredSite(null)}
                    onClick={() => onSiteClick(site, ti)}
                  >
                    {/* Pulsing ring for unmodified interactive sites */}
                    {!isModified && (
                      <circle cx={cx} cy={cy} r={baseRadius + 4} fill="none" stroke="#818cf8" strokeWidth={1} opacity={0.4}>
                        <animate attributeName="r" values={`${baseRadius + 2};${baseRadius + 6};${baseRadius + 2}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Modification glow */}
                    {isModified && (
                      <>
                        <circle cx={cx} cy={cy} r={radius + 6} fill={modColor} opacity={0.15} filter="url(#softGlow)">
                          <animate attributeName="r" values={`${radius + 4};${radius + 8};${radius + 4}`} dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={cx} cy={cy} r={radius + 3} fill="none" stroke={modColor} strokeWidth={1.5} opacity={0.5}>
                          <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                      </>
                    )}

                    {/* Valid target highlight */}
                    {canApply && selectedEnzyme && (
                      <circle cx={cx} cy={cy} r={radius + 5} fill="none" stroke={selectedEnzyme.color} strokeWidth={2} opacity={0.6} strokeDasharray="3,3">
                        <animate attributeName="stroke-dashoffset" values="0;12" dur="1s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Main residue circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill={modColor || "#2d2b55"}
                      stroke={isHovered ? "#fff" : modColor || "#6366f1"}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      filter={isModified ? "url(#glow)" : undefined}
                      style={{ transition: "all 0.2s ease" }}
                    />

                    {/* Site label inside */}
                    <text x={cx} y={cy + 3.5} textAnchor="middle" fill="#fff" fontSize={7} fontFamily="'JetBrains Mono', monospace" fontWeight="600" style={{ pointerEvents: "none" }}>
                      {site.label.replace("H3", "").replace("H4", "")}
                    </text>

                    {/* Hover tooltip */}
                    {isHovered && (
                      <g>
                        <rect x={cx - 95} y={cy - 50} width={190} height={36} rx={6} fill="#1e1b4b" stroke="#6366f1" strokeWidth={1} opacity={0.95} />
                        <text x={cx} y={cy - 36} textAnchor="middle" fill="#e2e8f0" fontSize={9} fontWeight="600" fontFamily="'JetBrains Mono', monospace">
                          {site.label} - {site.residue}
                        </text>
                        <text x={cx} y={cy - 23} textAnchor="middle" fill="#94a3b8" fontSize={8} fontFamily="system-ui">
                          {site.description}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Transcription particles when gene is active */}
        {score >= 40 &&
          Array.from({ length: 6 }, (_, i) => {
            const startX = 400 + (i - 3) * 15;
            return (
              <circle key={`mrna-${i}`} cx={startX} cy={200} r={3} fill="#22c55e" opacity={0.6}>
                <animate attributeName="cy" values="250;120;50" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.3;0" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
                <animate attributeName="cx" values={`${startX};${startX + (i - 3) * 20};${startX + (i - 3) * 40}`} dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        {score >= 40 && (
          <text x={400} y={140} textAnchor="middle" fill="#22c55e" fontSize={10} fontFamily="system-ui" opacity={0.7}>
            ↑ mRNA being transcribed
          </text>
        )}
      </svg>
    </div>
  );
}
