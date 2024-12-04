import { LitNodeClient } from "@lit-protocol/lit-node-client";
import * as ethers from 'ethers';

const LIT_PKP_PUBLIC_KEY = process.env.NEXT_PUBLIC_LIT_PKP_PUBLIC_KEY;

let litNodeClient = null;

async function initializeLitClient() {
  try {
    if (litNodeClient) {
      return litNodeClient;
    }

    console.log("🔄 Connecting to Lit network...");
    litNodeClient = new LitNodeClient({
      network: 'serrano',
      debug: false,
    });
    await litNodeClient.connect();
    console.log("✅ Connected to Lit network");

    return litNodeClient;
  } catch (error) {
    console.error("Failed to initialize Lit client:", error);
    litNodeClient = null;
    throw error;
  }
}

// Transaction Action code that will execute on Lit nodes
const _transactionActionCode = async () => {
  const signature = await LitActions.signEcdsa({
    toSign: unsignedTxHash,
    publicKey,
    sigName: "sig1",
  });

  // Format and send the transaction
  const formattedSignature = {
    r: "0x" + signature.r,
    s: "0x" + signature.s,
    v: signature.recid,
  };

  const signedTx = ethers.utils.serializeTransaction(
    unsignedTransaction,
    formattedSignature
  );

  // Send transaction
  const rpcUrl = "https://rpc-mumbai.maticvigil.com"; // Using Mumbai testnet
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const txResponse = await provider.sendTransaction(signedTx);

  LitActions.setResponse({ response: txResponse.hash });
};

export const transactionActionCode = `(${_transactionActionCode.toString()})();`;