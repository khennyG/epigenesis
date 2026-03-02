// Quiz Mode Challenges - based on Phase 3 of EpiGenesis spec

export const CHALLENGES = [
  {
    id: 1,
    title: "Wake Up the Gene",
    difficulty: "Beginner",
    scenario: "This gene is silenced and needs to be activated. A patient needs this gene active to produce a critical protein.",
    description: "Apply the right modifications to open up the chromatin and activate gene expression.",
    objective: "Reach a positive chromatin state (Euchromatin) to activate the gene.",
    hint: "HAT enzymes add acetyl groups that loosen DNA. Try acetylating lysine residues!",
    targetScore: 50,
    solution: "Apply HAT to add acetylation marks to H3 or H4 lysine residues.",
  },
  {
    id: 2,
    title: "Silence the Oncogene",
    difficulty: "Intermediate",
    scenario: "This oncogene is abnormally active in a cancer cell. In healthy cells, it should be silenced to prevent uncontrolled cell division.",
    description: "Apply silencing modifications to shut down this overactive gene.",
    objective: "Reach a negative chromatin state (Heterochromatin) to silence the gene.",
    hint: "HMT (silencing) adds methyl groups to H3K9 or H3K27, creating stable silencing marks.",
    targetScore: -30,
    solution: "Apply HMT (silencing) to add methylation at H3K9 or H3K27.",
  },
  {
    id: 3,
    title: "The Cancer Connection",
    difficulty: "Advanced",
    scenario: "Cancer cells often have overactive HDACs that remove acetylation marks globally. This silences tumor suppressor genes that normally prevent cancer.",
    description: "Experience what happens when too many genes get silenced. Then learn why HDAC inhibitors are used as cancer drugs.",
    objective: "Use HDAC to remove acetylation and observe the effect on gene expression.",
    hint: "HDAC removes acetyl groups, causing DNA to tighten and genes to silence.",
    targetScore: -50,
    solution: "Apply HDAC to remove acetylation marks, silencing the gene completely.",
  },
];

export default CHALLENGES;
