import {
  LogInWithAnonAadhaar,
  useAnonAadhaar,
  AnonAadhaarProof,
} from "@anon-aadhaar/react";
import { useEffect } from "react";
import { verify } from "@anon-aadhaar/core";
import { useProver } from "@anon-aadhaar/react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { create } from "@/utils/rollup";
import { AnonAadhaarProoftype } from "../utils/types";

export default function Home() {
  const [anonAadhaar] = useAnonAadhaar();
  const [, latestProof] = useProver();
  const { address } = useAccount();
  const [isVerified, setIsVerified] = useState(false);
  const [proof, setProof] = useState<AnonAadhaarProoftype>();
  const [wallet, setWallet] = useState(null)

  console.log("Anon Aadhaar: ", latestProof);
  console.log(address);
  console.log(proof);
  console.log(isVerified);

  useEffect(() => {
    console.log("Anon Aadhaar status: ", anonAadhaar.status);
  }, [anonAadhaar]);

  const verifyProof = async () => {
    if (!latestProof) return;
    const verified = await verify(latestProof);
    setIsVerified(verified);
    setProof({
      signalHash: latestProof.proof.signalHash,
      nullifier: latestProof.proof.nullifier,
      ageAbove18: latestProof.proof.ageAbove18,
      timestamp: latestProof.proof.timestamp,
      state: latestProof.proof.state,
      pincode: latestProof.proof.pincode,
      nullifierSeed: latestProof.proof.nullifierSeed,
      //@ts-ignore
      groth16Proof: latestProof.proof.groth16Proof,
      pubkeyHash: latestProof.proof.pubkeyHash,
      gender: latestProof.proof.gender,
      isVerified: isVerified,
    });
  };

  return (
    <div>
      {address ? (
        <div>
          <div>
            <LogInWithAnonAadhaar
              nullifierSeed={12345}
              fieldsToReveal={["revealAgeAbove18"]}
            />
            <p>{anonAadhaar?.status}</p>
          </div>
          <div>
            {anonAadhaar?.status === "logged-in" && (
              <>
                <p>✅ Proof is valid</p>
                <AnonAadhaarProof
                  code={JSON.stringify(anonAadhaar.anonAadhaarProofs, null, 2)}
                />
                {latestProof && (
                  <button
                    onClick={() => {
                      verifyProof();
                    }}
                  >
                    verify
                  </button>
                )}
                {isVerified && (
                  <div>
                    <button
                      onClick={() =>
                        proof && create({ address: address, proof: proof })
                      }
                    >
                      create
                    </button>
                    <p>✅ Proof is verified</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <ConnectButton />
      )}
    </div>
  );
}
