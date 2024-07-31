type Groth16Proof = {
  curve: string;
  pi_a: [string, string, string];
  pi_b: [[string, string], [string, string], [string, string]];
  pi_c: [string, string, string];
  protocol: string;
};

export type AnonAadhaarProof = {
  groth16Proof: Groth16Proof;
  pubkeyHash: string;
  timestamp: string;
  nullifierSeed: string;
  nullifier: string;
  signalHash: string;
  ageAbove18: string;
  gender: string;
  pincode: string;
  state: string;
  isVerified: boolean
};
