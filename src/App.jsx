import { useState, useCallback } from 'react';
import { useSimulationStore, calcExpressionScore, getGeneStatus } from './store/useSimulationStore';
import Nucleosome from './components/3d/Nucleosome';
import CameraControls from './components/ui/CameraControls';
import ENZYMES from './data/enzymes';
import CHALLENGES from './data/challenges';
import { MODIFICATION_SITES } from './data/modifications';

// ============================================================
// LANDING PAGE COMPONENT
// ============================================================

function LandingPage({ onStartSimulation, onStartGame }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0a0e27 0%, #0f1333 50%, #0a0e27 100%)",
      color: "#e2e8f0",
      fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      padding: "40px 60px",
    }}>
      {/* Animated background particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            borderRadius: "50%",
            background: i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#f97066" : "#2dd4bf",
            left: `${(i * 3.7) % 100}%`,
            top: `${(i * 7.3) % 100}%`,
            opacity: 0.15 + (i % 5) * 0.05,
            animation: `float ${8 + i % 6}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      {/* Main content - two column layout */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        gap: 80, 
        zIndex: 1, 
        maxWidth: 1200,
        width: "100%",
        animation: "fadeUp 0.8s ease-out",
      }}>
        {/* Left side - Cloey's profile */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          textAlign: "center",
          minWidth: 280,
        }}>
          {/* Profile picture placeholder */}
          <div style={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #c084fc 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            marginBottom: 24,
            border: "4px solid rgba(129, 140, 248, 0.3)",
            boxShadow: "0 0 40px rgba(99, 102, 241, 0.3)",
            overflow: "hidden",
          }}>
            {/* Replace this with an actual image tag when you have Cloey's photo */}
            <span style={{ opacity: 0.9 }}>👩‍🔬</span>
          </div>
          
          <h2 style={{
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 8,
            background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Cloey
          </h2>
          
          <p style={{
            fontSize: 14,
            color: "#818cf8",
            fontWeight: 500,
            marginBottom: 12,
          }}>
            Developmental and Brain Sciences PhD Student
          </p>
          
          <p style={{
            fontSize: 13,
            color: "#64748b",
            lineHeight: 1.6,
            maxWidth: 260,
          }}>
            UMass Boston
          </p>
        </div>

        {/* Right side - Title and actions */}
        <div style={{ 
          display: "flex", 
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 500,
        }}>
          <div style={{
            display: "inline-block",
            padding: "6px 16px",
            borderRadius: 20,
            background: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 1.5,
            color: "#818cf8",
            marginBottom: 20,
            textTransform: "uppercase",
          }}>
            Interactive 3D Epigenetics
          </div>

          <h1 style={{
            fontSize: "clamp(42px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 16,
            background: "linear-gradient(135deg, #818cf8 0%, #c084fc 30%, #f472b6 60%, #fb923c 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 4s linear infinite",
          }}>
            EpiGenesis
          </h1>

          <p style={{ 
            fontSize: 16, 
            lineHeight: 1.7, 
            color: "#94a3b8", 
            marginBottom: 32,
            fontWeight: 300,
          }}>
            Explore the fascinating world of epigenetics through interactive 3D visualization. 
            Watch how chemical modifications to histone proteins control gene expression in real-time.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button
              onClick={onStartSimulation}
              style={{
                padding: "14px 32px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 8,
                animation: "pulseGlow 2s ease-in-out infinite",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Start Exploring
            </button>

            <button
              onClick={onStartGame}
              style={{
                padding: "14px 32px",
                borderRadius: 12,
                border: "1px solid rgba(99, 102, 241, 0.4)",
                background: "rgba(99, 102, 241, 0.1)",
                color: "#c4b5fd",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)"; e.currentTarget.style.transform = "scale(1.05)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              Game Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ONBOARDING STEPS
// ============================================================

const onboardingSteps = [
  { title: "Welcome to EpiGenesis! 🧬", text: "This is a nucleosome, DNA (the colored helix) wrapped around a barrel of histone proteins. The small circles on the extending tails are amino acid residues where chemical modifications happen." },
  { title: "The Glowing Sites ✨", text: "See the pulsing circles on the histone tails? Those are modification sites. Each one can be chemically tagged to change how tightly DNA wraps, which controls whether genes are ON or OFF." },
  { title: "Try It! 🧪", text: "Select an enzyme from the left panel (like HAT), then click on a glowing site. Watch the DNA loosen or tighten, and the gene status change. Experiment freely!" },
];

// ============================================================
// MAIN APP COMPONENT
// ============================================================

export default function App() {
  const [mode, setMode] = useState("landing");
  const [selectedEnzyme, setSelectedEnzyme] = useState(null);
  const [modifications, setModifications] = useState({});
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  // 3D View Controls
  const [currentView, setCurrentView] = useState('default');
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const score = calcExpressionScore(modifications);
  const status = getGeneStatus(score);

  // Update store with local state (for NucleosomeVisualization)
  const store = useSimulationStore();
  
  // Sync local state to store
  store.modifications = modifications;
  store.selectedEnzyme = selectedEnzyme;

  const showNotif = useCallback((msg, type = "info") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleSiteClick = useCallback((site, tailIndex) => {
    if (!selectedEnzyme) {
      showNotif(`${site.label}: ${site.description}`, "info");
      return;
    }

    const siteKey = site.id;
    const mod = modifications[siteKey];

    let newModType = null;
    let valid = false;

    switch (selectedEnzyme.action) {
      case "acetylate":
        if (site.canAcetylate && !mod) { newModType = "acetylation"; valid = true; }
        else if (!site.canAcetylate) showNotif(`Cannot acetylate ${site.label} - only lysine residues can be acetylated`, "error");
        else showNotif(`${site.label} already has a modification - remove it first`, "error");
        break;
      case "methylate_activate":
        if (site.canMethylate && site.methylEffect === "activate" && !mod) { newModType = "methylation_activate"; valid = true; }
        else if (site.methylEffect !== "activate") showNotif(`${site.label} is not an activating methylation site`, "error");
        else if (mod) showNotif(`${site.label} already modified`, "error");
        else showNotif(`Cannot methylate ${site.label}`, "error");
        break;
      case "methylate_silence":
        if (site.canMethylate && site.methylEffect === "silence" && !mod) { newModType = "methylation_silence"; valid = true; }
        else if (site.methylEffect !== "silence") showNotif(`${site.label} is not a silencing methylation site`, "error");
        else if (mod) showNotif(`${site.label} already modified`, "error");
        else showNotif(`Cannot methylate ${site.label}`, "error");
        break;
      case "phosphorylate":
        if (site.canPhosphorylate && !mod) { newModType = "phosphorylation"; valid = true; }
        else if (!site.canPhosphorylate) showNotif(`Cannot phosphorylate ${site.label} - only serine/threonine residues`, "error");
        else showNotif(`${site.label} already modified`, "error");
        break;
      case "deacetylate":
        if (mod?.type === "acetylation") { valid = true; }
        else showNotif(`No acetyl group on ${site.label} to remove`, "error");
        break;
      case "demethylate":
        if (mod?.type === "methylation_activate" || mod?.type === "methylation_silence") { valid = true; }
        else showNotif(`No methyl group on ${site.label} to remove`, "error");
        break;
      case "dephosphorylate":
        if (mod?.type === "phosphorylation") { valid = true; }
        else showNotif(`No phosphate group on ${site.label} to remove`, "error");
        break;
    }

    if (valid) {
      const newMods = { ...modifications };
      if (newModType) {
        newMods[siteKey] = { type: newModType, enzyme: selectedEnzyme.id };
        showNotif(`✓ ${selectedEnzyme.name} applied to ${site.label}`, "success");
      } else {
        delete newMods[siteKey];
        showNotif(`✓ Removed modification from ${site.label}`, "success");
      }
      setHistory((h) => [...h, { site: siteKey, enzyme: selectedEnzyme.id, prev: modifications[siteKey] || null, next: newMods[siteKey] || null }]);
      setModifications(newMods);
    }
  }, [selectedEnzyme, modifications, showNotif]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const newMods = { ...modifications };
    if (last.prev) newMods[last.site] = last.prev;
    else delete newMods[last.site];
    setModifications(newMods);
    setHistory((h) => h.slice(0, -1));
  };

  const handleReset = () => {
    setModifications({});
    setHistory([]);
    setSelectedEnzyme(null);
  };

  // LANDING PAGE
  if (mode === "landing") {
    return (
      <LandingPage 
        onStartSimulation={() => { setMode("simulate"); }}
        onStartGame={() => { setMode("game"); setCurrentLevel(CHALLENGES[0]); handleReset(); }}
      />
    );
  }

  // SIMULATION / GAME MODE
  const isLevel = mode === "game" && currentLevel;

  return (
    <div style={{
      height: "100vh",
      maxHeight: "100vh",
      background: "linear-gradient(180deg, #0a0e27 0%, #0f1333 100%)",
      color: "#e2e8f0",
      fontFamily: "'Sora', 'DM Sans', system-ui, sans-serif",
      display: "flex",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* ===== LEFT PANEL - Enzymes ===== */}
      <div style={{
        width: 280,
        minWidth: 280,
        background: "rgba(15, 19, 51, 0.8)",
        backdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(99, 102, 241, 0.1)",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        overflowY: "auto",
        animation: "slideIn 0.5s ease-out",
      }}>
        {/* Back button and Logo */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <button
              onClick={() => { setMode("landing"); handleReset(); }}
              style={{
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 12,
                color: "#818cf8",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = "rgba(99, 102, 241, 0.2)"; }}
              onMouseOut={(e) => { e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)"; }}
            >
              <span style={{ fontSize: 14 }}>←</span> Back
            </button>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, background: "linear-gradient(135deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            EpiGenesis
          </h1>
          <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Interactive Epigenetics Simulator</p>
        </div>

        {/* Level card */}
        {isLevel && (
          <div style={{
            padding: 14,
            borderRadius: 12,
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
            border: "1px solid rgba(99,102,241,0.3)",
            marginBottom: 4,
          }}>
            <div style={{ fontSize: 10, color: "#818cf8", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
              Level {currentLevel.id} - {currentLevel.difficulty}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{currentLevel.title}</div>
            {currentLevel.scenario && (
              <div style={{ fontSize: 11, color: "#c4b5fd", lineHeight: 1.5, marginBottom: 8, fontStyle: "italic" }}>
                "{currentLevel.scenario}"
              </div>
            )}
            <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.5 }}>{currentLevel.description}</div>
            {currentLevel.objective && (
              <div style={{ fontSize: 10, color: "#60a5fa", marginTop: 8 }}>
                Objective: {currentLevel.objective}
              </div>
            )}
            <div style={{ fontSize: 10, color: "#f59e0b", marginTop: 8, fontStyle: "italic" }}>{currentLevel.hint}</div>
            {score >= currentLevel.targetScore && currentLevel.targetScore > 0 && (
              <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 8, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                Level Complete!
              </div>
            )}
            {score <= currentLevel.targetScore && currentLevel.targetScore < 0 && (
              <div style={{ marginTop: 8, padding: "6px 10px", borderRadius: 8, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", fontSize: 12, color: "#22c55e", fontWeight: 600 }}>
                Level Complete!
              </div>
            )}
          </div>
        )}

        <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Enzymes</div>
        <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>
          {selectedEnzyme ? `Selected: ${selectedEnzyme.name} - click a valid site` : "Select an enzyme, then click a histone tail site"}
        </div>

        {/* Writers */}
        <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginTop: 4 }}>Writers</div>
        {ENZYMES.filter((e) => e.type === "writer").map((enzyme) => (
          <button
            key={enzyme.id}
            onClick={() => setSelectedEnzyme(selectedEnzyme?.id === enzyme.id ? null : enzyme)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              border: selectedEnzyme?.id === enzyme.id ? `2px solid ${enzyme.color}` : "1px solid rgba(255,255,255,0.06)",
              background: selectedEnzyme?.id === enzyme.id ? `${enzyme.color}15` : "rgba(255,255,255,0.02)",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "all 0.2s",
              fontFamily: "inherit",
              color: "#e2e8f0",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, color: enzyme.color, minWidth: 20 }}>{enzyme.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {enzyme.name} <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: enzyme.color, marginLeft: 4 }} />
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{enzyme.desc}</div>
              <div style={{ fontSize: 10, color: enzyme.color, marginTop: 2, fontWeight: 500 }}>{enzyme.effect}</div>
            </div>
          </button>
        ))}

        {/* Erasers */}
        <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginTop: 8 }}>Erasers</div>
        {ENZYMES.filter((e) => e.type === "eraser").map((enzyme) => (
          <button
            key={enzyme.id}
            onClick={() => setSelectedEnzyme(selectedEnzyme?.id === enzyme.id ? null : enzyme)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              border: selectedEnzyme?.id === enzyme.id ? `2px solid ${enzyme.color}` : "1px solid rgba(255,255,255,0.06)",
              background: selectedEnzyme?.id === enzyme.id ? `${enzyme.color}15` : "rgba(255,255,255,0.02)",
              cursor: "pointer",
              width: "100%",
              textAlign: "left",
              transition: "all 0.2s",
              fontFamily: "inherit",
              color: "#e2e8f0",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1, color: enzyme.color, minWidth: 20 }}>{enzyme.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {enzyme.name} <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: enzyme.color, marginLeft: 4 }} />
              </div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{enzyme.desc}</div>
              <div style={{ fontSize: 10, color: enzyme.color, marginTop: 2, fontWeight: 500 }}>{enzyme.effect}</div>
            </div>
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* Modification log */}
        {Object.keys(modifications).length > 0 && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, marginTop: 8 }}>
            <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 6 }}>
              Active Modifications ({Object.keys(modifications).length})
            </div>
            {Object.entries(modifications).map(([key, mod]) => (
              <div key={key} style={{ fontSize: 11, color: "#94a3b8", padding: "3px 0", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: mod.type === "acetylation" ? "#22c55e" : mod.type === "phosphorylation" ? "#eab308" : mod.type === "methylation_activate" ? "#f59e0b" : "#ef4444",
                }} />
                {key}: {mod.type.replace("_", " ")}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative", minHeight: 0, overflow: "hidden" }}>
        {/* Top bar - Chromatin State */}
        <div style={{
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          animation: "fadeUp 0.5s ease-out 0.2s both",
        }}>
          <div style={{
            padding: "12px 24px",
            borderRadius: 16,
            background: "rgba(15, 19, 51, 0.7)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(99, 102, 241, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: 20,
            minWidth: 400,
          }}>
            <div>
              <div style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 4 }}>Chromatin State</div>
              <div style={{ width: 200, height: 8, borderRadius: 4, background: "linear-gradient(90deg, #ef4444, #f59e0b, #22c55e)", position: "relative" }}>
                <div style={{
                  position: "absolute",
                  top: -3,
                  left: `${(score + 100) / 2}%`,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: status.color,
                  border: "2px solid #fff",
                  transition: "left 0.8s ease",
                  boxShadow: `0 0 10px ${status.color}`,
                }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#64748b", marginTop: 2 }}>
                <span>Heterochromatin</span>
                <span>Euchromatin</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: status.color, display: "flex", alignItems: "center", gap: 6, transition: "color 0.5s" }}>
                {status.emoji} {status.label}
              </div>
              <div style={{ fontSize: 10, color: "#64748b" }}>{status.desc}</div>
            </div>
          </div>
        </div>

        {/* 3D Visualization */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", minHeight: 0, overflow: "hidden" }}>
          <Nucleosome 
            modifications={modifications}
            selectedEnzyme={selectedEnzyme}
            onSiteClick={handleSiteClick}
            showLabels={showLabels}
            autoRotate={autoRotate}
            currentView={currentView}
            wrappingTightness={(score + 100) / 200} // Convert score -100 to 100 into 0 to 1
          />
          
          {/* Camera Controls - Bottom Right */}
          <div style={{
            position: "absolute",
            right: 20,
            bottom: 20,
            zIndex: 10,
          }}>
            <CameraControls
              currentView={currentView}
              onViewChange={setCurrentView}
              autoRotate={autoRotate}
              onAutoRotateToggle={() => setAutoRotate(!autoRotate)}
              showLabels={showLabels}
              onLabelsToggle={() => setShowLabels(!showLabels)}
            />
          </div>
        </div>

        {/* Level selector buttons - right side (only shown in quiz mode) */}
        {isLevel && (
        <div style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}>
          {CHALLENGES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => { setCurrentLevel(c); handleReset(); }}
              title={c.title}
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                border: currentLevel?.id === c.id ? "2px solid #6366f1" : "1px solid rgba(255,255,255,0.08)",
                background: currentLevel?.id === c.id ? "rgba(99,102,241,0.2)" : "rgba(15, 19, 51, 0.7)",
                backdropFilter: "blur(10px)",
                color: "#e2e8f0",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
        )}

        {/* Notification */}
        {notification && (
          <div style={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            borderRadius: 10,
            background: notification.type === "success" ? "rgba(34,197,94,0.15)" : notification.type === "error" ? "rgba(239,68,68,0.15)" : "rgba(99,102,241,0.15)",
            border: `1px solid ${notification.type === "success" ? "rgba(34,197,94,0.3)" : notification.type === "error" ? "rgba(239,68,68,0.3)" : "rgba(99,102,241,0.3)"}`,
            color: notification.type === "success" ? "#22c55e" : notification.type === "error" ? "#f87171" : "#818cf8",
            fontSize: 13,
            fontWeight: 500,
            animation: "notifIn 0.3s ease-out",
            backdropFilter: "blur(10px)",
            zIndex: 100,
          }}>
            {notification.msg}
          </div>
        )}

        {/* Onboarding overlay */}
        {showOnboarding && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10, 14, 39, 0.85)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            animation: "fadeUp 0.3s ease-out",
          }}>
            <div style={{
              maxWidth: 420,
              padding: 32,
              borderRadius: 20,
              background: "rgba(30, 27, 75, 0.9)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 10, color: "#64748b", marginBottom: 8 }}>Step {onboardingStep + 1} of {onboardingSteps.length}</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{onboardingSteps[onboardingStep].title}</h2>
              <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>{onboardingSteps[onboardingStep].text}</p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep((s) => s - 1)}
                    style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onboardingStep < onboardingSteps.length - 1) setOnboardingStep((s) => s + 1);
                    else setShowOnboarding(false);
                  }}
                  style={{
                    padding: "8px 24px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    fontFamily: "inherit",
                  }}
                >
                  {onboardingStep < onboardingSteps.length - 1 ? "Next" : "Got it - let me explore!"}
                </button>
              </div>
              {/* Step dots */}
              <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 16 }}>
                {onboardingSteps.map((_, i) => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i === onboardingStep ? "#6366f1" : "#374151", transition: "background 0.3s" }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
