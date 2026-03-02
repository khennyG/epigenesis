import { create } from 'zustand';
import MODIFICATION_SITES from '../data/modifications';

// Calculate expression score based on modifications - matching EpiGenesis.jsx
function calcExpressionScore(modifications) {
  let score = 0;
  Object.values(modifications).forEach((mod) => {
    if (mod.type === "acetylation") score += 15;
    if (mod.type === "phosphorylation") score += 12;
    if (mod.type === "methylation_activate") score += 10;
    if (mod.type === "methylation_silence") score -= 20;
  });
  return Math.max(-100, Math.min(100, score));
}

// Get gene status based on score - matching EpiGenesis.jsx
function getGeneStatus(score) {
  if (score >= 50) return { label: "ACTIVE", emoji: "🟢", color: "#22c55e", desc: "Gene is being actively transcribed" };
  if (score >= 20) return { label: "POISED", emoji: "🟡", color: "#eab308", desc: "Chromatin is loosening, gene is ready" };
  if (score > -20) return { label: "BALANCED", emoji: "⚖️", color: "#94a3b8", desc: "Chromatin is in a neutral state" };
  if (score > -50) return { label: "REPRESSED", emoji: "🟠", color: "#f97066", desc: "Gene expression is being reduced" };
  return { label: "SILENCED", emoji: "🔴", color: "#ef4444", desc: "Gene is tightly silenced" };
}

export const useSimulationStore = create((set, get) => ({
  // App mode: 'landing', 'simulate', 'challenge'
  mode: 'landing',
  
  // Current modifications on each site
  modifications: {},
  
  // Currently selected enzyme (null or enzyme object)
  selectedEnzyme: null,
  
  // Modification history for undo
  history: [],
  
  // Currently hovered site
  hoveredSite: null,
  
  // Notification state
  notification: null,
  
  // Challenge state
  currentChallenge: null,
  
  // Onboarding state
  showOnboarding: true,
  onboardingStep: 0,
  
  // Computed values
  getScore: () => calcExpressionScore(get().modifications),
  getStatus: () => getGeneStatus(calcExpressionScore(get().modifications)),
  
  // Actions
  setMode: (mode) => set({ mode }),
  
  setSelectedEnzyme: (enzyme) => set({ selectedEnzyme: enzyme }),
  
  setHoveredSite: (site) => set({ hoveredSite: site }),
  
  setCurrentChallenge: (challenge) => set({ currentChallenge: challenge }),
  
  setShowOnboarding: (show) => set({ showOnboarding: show }),
  
  setOnboardingStep: (step) => set({ onboardingStep: step }),
  
  showNotification: (msg, type = "info") => {
    set({ notification: { msg, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },
  
  applyModification: (siteKey, modType, enzymeId) => {
    const { modifications, history } = get();
    const newMods = { ...modifications };
    const prev = modifications[siteKey] || null;
    
    if (modType) {
      newMods[siteKey] = { type: modType, enzyme: enzymeId };
    } else {
      delete newMods[siteKey];
    }
    
    set({
      modifications: newMods,
      history: [...history, { site: siteKey, enzyme: enzymeId, prev, next: newMods[siteKey] || null }],
    });
  },
  
  handleUndo: () => {
    const { history, modifications } = get();
    if (history.length === 0) return;
    
    const last = history[history.length - 1];
    const newMods = { ...modifications };
    
    if (last.prev) {
      newMods[last.site] = last.prev;
    } else {
      delete newMods[last.site];
    }
    
    set({
      modifications: newMods,
      history: history.slice(0, -1),
    });
  },
  
  handleReset: () => {
    set({
      modifications: {},
      history: [],
      selectedEnzyme: null,
    });
  },
  
  // Check if enzyme can be applied to a site
  canApplyEnzyme: (site, enzyme) => {
    if (!enzyme) return false;
    const { modifications } = get();
    const mod = modifications[site.id];
    
    switch (enzyme.action) {
      case "acetylate": return site.canAcetylate && !mod;
      case "methylate_activate": return site.canMethylate && site.methylEffect === "activate" && !mod;
      case "methylate_silence": return site.canMethylate && site.methylEffect === "silence" && !mod;
      case "phosphorylate": return site.canPhosphorylate && !mod;
      case "deacetylate": return mod?.type === "acetylation";
      case "demethylate": return mod?.type === "methylation_activate" || mod?.type === "methylation_silence";
      case "dephosphorylate": return mod?.type === "phosphorylation";
      default: return false;
    }
  },
}));

export { calcExpressionScore, getGeneStatus };
export default useSimulationStore;
