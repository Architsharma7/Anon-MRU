import { Wallet } from "ethers";
import { AnonAadhaarProoftype } from "./types";

type createType = {
  address: `0x${string}`;
  proof: AnonAadhaarProoftype;
};

const domain = {
  name: "Stackr MVP v0",
  version: "1",
  chainId: 11155111,
  verifyingContract: "0xaA13be163EEb35662219f81fe1e26fa5B1dD186B",
  salt: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
};

export const create = async (data: createType) => {
  const actionName = "create";
  const wallet = Wallet.createRandom();

  try {
    const response = await fetch(
      `http://localhost:3000/getEIP712Types/${actionName}`
    );

    const eip712Types = (await response.json()).eip712Types;
    console.log(eip712Types);

    const inputs: createType = {
      address: data.address,
      proof: data.proof,
    };

    const signature = await wallet._signTypedData(domain, eip712Types, inputs);

    const body = JSON.stringify({
      msgSender: data.address,
      signature,
      inputs,
    });

    const res = await fetch(`http://localhost:3000/${actionName}`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    console.log(`Response: ${JSON.stringify(json, null, 2)}`);
    console.log(json);
    return { ack: json };
  } catch (error) {
    console.log(error);
  }
};
