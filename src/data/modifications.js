// Modification sites - matching EpiGenesis.jsx exactly

export const MODIFICATION_SITES = {
  H3: [
    {
      id: "H3K4",
      label: "H3K4",
      residue: "Lysine 4",
      position: 3,
      canAcetylate: false,
      canMethylate: true,
      canPhosphorylate: false,
      methylEffect: "activate",
      description: "When methylated, this activates nearby genes"
    },
    {
      id: "H3K9",
      label: "H3K9",
      residue: "Lysine 9",
      position: 5,
      canAcetylate: true,
      canMethylate: true,
      canPhosphorylate: false,
      methylEffect: "silence",
      description: "When methylated, this silences the nearby gene"
    },
    {
      id: "H3S10",
      label: "H3S10",
      residue: "Serine 10",
      position: 6,
      canAcetylate: false,
      canMethylate: false,
      canPhosphorylate: true,
      description: "Phosphorylation here opens chromatin"
    },
    {
      id: "H3K14",
      label: "H3K14",
      residue: "Lysine 14",
      position: 8,
      canAcetylate: true,
      canMethylate: false,
      canPhosphorylate: false,
      description: "Acetylation here activates gene expression"
    },
    {
      id: "H3K27",
      label: "H3K27",
      residue: "Lysine 27",
      position: 11,
      canAcetylate: true,
      canMethylate: true,
      canPhosphorylate: false,
      methylEffect: "silence",
      description: "Methylation here is a Polycomb silencing mark"
    },
    {
      id: "H3K36",
      label: "H3K36",
      residue: "Lysine 36",
      position: 13,
      canAcetylate: false,
      canMethylate: true,
      canPhosphorylate: false,
      methylEffect: "activate",
      description: "Methylation here marks active gene bodies"
    },
  ],
  H4: [
    {
      id: "H4K5",
      label: "H4K5",
      residue: "Lysine 5",
      position: 3,
      canAcetylate: true,
      canMethylate: false,
      canPhosphorylate: false,
      description: "Acetylation here loosens chromatin"
    },
    {
      id: "H4K8",
      label: "H4K8",
      residue: "Lysine 8",
      position: 5,
      canAcetylate: true,
      canMethylate: false,
      canPhosphorylate: false,
      description: "Acetylation here promotes gene activation"
    },
    {
      id: "H4K16",
      label: "H4K16",
      residue: "Lysine 16",
      position: 9,
      canAcetylate: true,
      canMethylate: false,
      canPhosphorylate: false,
      description: "Key acetylation site for chromatin decompaction"
    },
  ],
};

export default MODIFICATION_SITES;
