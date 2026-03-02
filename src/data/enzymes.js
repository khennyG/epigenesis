// Enzyme definitions - matching EpiGenesis.jsx exactly

export const ENZYMES = [
  {
    id: "HAT",
    name: "HAT",
    fullName: "Histone Acetyltransferase",
    type: "writer",
    action: "acetylate",
    color: "#22c55e",
    icon: "✦",
    desc: "Adds acetyl group to lysine",
    effect: "Loosens DNA → Gene ON"
  },
  {
    id: "HMT_act",
    name: "HMT",
    fullName: "Histone Methyltransferase",
    type: "writer",
    action: "methylate_activate",
    color: "#f59e0b",
    icon: "◆",
    desc: "Adds methyl to H3K4 or H3K36",
    effect: "Gene ON"
  },
  {
    id: "HMT_sil",
    name: "HMT",
    fullName: "Histone Methyltransferase",
    type: "writer",
    action: "methylate_silence",
    color: "#ef4444",
    icon: "◆",
    desc: "Adds methyl to H3K9 or H3K27",
    effect: "Tightens DNA → Gene OFF"
  },
  {
    id: "Kinase",
    name: "Kinase",
    fullName: "Histone Kinase",
    type: "writer",
    action: "phosphorylate",
    color: "#eab308",
    icon: "⚡",
    desc: "Adds phosphate group to serine",
    effect: "Loosens DNA → Gene ON"
  },
  {
    id: "HDAC",
    name: "HDAC",
    fullName: "Histone Deacetylase",
    type: "eraser",
    action: "deacetylate",
    color: "#f97066",
    icon: "✕",
    desc: "Removes acetyl group",
    effect: "Tightens DNA → Gene OFF"
  },
  {
    id: "HDM",
    name: "HDM/KDM",
    fullName: "Histone Demethylase",
    type: "eraser",
    action: "demethylate",
    color: "#a78bfa",
    icon: "◇",
    desc: "Removes methyl group",
    effect: "Depends on context"
  },
  {
    id: "Phosphatase",
    name: "Phosphatase",
    fullName: "Histone Phosphatase",
    type: "eraser",
    action: "dephosphorylate",
    color: "#94a3b8",
    icon: "○",
    desc: "Removes phosphate group",
    effect: "Tightens DNA"
  },
];

export default ENZYMES;
