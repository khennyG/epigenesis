// Histone configuration - tail positions for the SVG visualization

export const TAIL_CONFIGS = [
  {
    histone: "H3",
    side: "left",
    baseX: 240,
    baseY: 280,
    angle: -140,
    tailColor: "#8b6cc1"
  },
  {
    histone: "H3",
    side: "right",
    baseX: 560,
    baseY: 280,
    angle: -40,
    tailColor: "#8b6cc1"
  },
  {
    histone: "H4",
    side: "left",
    baseX: 270,
    baseY: 380,
    angle: -160,
    tailColor: "#5cb85c"
  },
  {
    histone: "H4",
    side: "right",
    baseX: 530,
    baseY: 380,
    angle: -20,
    tailColor: "#5cb85c"
  },
];

export const HISTONE_COLORS = {
  H2A: "#4a90d9",
  H2B: "#45b7a0",
  H3: "#8b6cc1",
  H4: "#5cb85c",
};

export default { TAIL_CONFIGS, HISTONE_COLORS };
