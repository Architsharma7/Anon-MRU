import {
  init,
  prove,
  InitArgs,
  generateArgs,
  ArtifactsOrigin,
  verify,
} from "@anon-aadhaar/core";
import { testQRData as QRData } from "../constants/dataInput.json"
import fs from "fs";

console.log("Starting the test");
console.log("Test QR Data: ", QRData);

const run = async () => {
  const certificate = await fs.readFileSync(__dirname + "/../constants/testCertificate.pem").toString();

  const anonAadhaarInitArgs: InitArgs = {
    wasmURL: __dirname + "/../constants/aadhaar-verifier.wasm",
    zkeyURL: __dirname + "/../constants/circuit_final.zkey",
    vkeyURL: __dirname + "/../constants/vkey.json",
    artifactsOrigin: ArtifactsOrigin.local,
  };

  console.log("anonAadhaarInitArgs: ", anonAadhaarInitArgs);

  // Initialize the core package
  const anonpackage = await init(anonAadhaarInitArgs);
  console.log("anon package", anonpackage);

  const nullifierSeed = 5054212167173668721117769221419434238204;

  // QRData: the string read from the QR code
  // certificate: x509 certificate containing the public key
  // it can be downloaded from: https://www.uidai.gov.in/en/916-developer-section/data-and-downloads-section/11349-uidai-certificate-details.html
  const args = await generateArgs({
    qrData: QRData,
    certificateFile: certificate,
    nullifierSeed,
  });

  console.log("Generated args: ", args);

  const anonAadhaarProof = await prove(args);

  console.log("Proof: ", anonAadhaarProof);

  const verified = await verify(anonAadhaarProof);

  console.log("Verified: ", verified);
};

run();
