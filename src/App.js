import React, { useState } from 'react';
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import * as ethers from 'ethers';

async function sendEthTransaction(ethAddress, client) {
  try {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");
    const gasPrice = await provider.getGasPrice();
    
    const unsignedTransaction = {
      to: ethAddress,
      value: ethers.utils.parseUnits("1000", "wei"),
      gasLimit: "21000",
      gasPrice: gasPrice.toHexString(),
      nonce: await provider.getTransactionCount(ethers.utils.computeAddress(`0x${LIT_PKP_PUBLIC_KEY}`)),
      chainId: 80001, // Mumbai testnet
    };

    const unsignedTxHash = ethers.utils.keccak256(
      ethers.utils.serializeTransaction(unsignedTransaction)
    );

    const litActionResponse = await client.executeJs({
      code: transactionActionCode,
      jsParams: {
        unsignedTxHash,
        unsignedTransaction,
        publicKey: LIT_PKP_PUBLIC_KEY,
      },
    });

    return litActionResponse.response;
  } catch (error) {
    console.error("Error sending ETH transaction:", error);
    throw error;
  }
}

function App() {
  const [tonAddress, setTonAddress] = useState('');
  const [ethAddress, setEthAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  
  const handleTransaction = async () => {
    try {
      setStatus('Processing...');
      

      if (parseFloat(amount) !== 0.001) {
        throw new Error('Amount must be exactly 0.001 TON');
      }


      const tonTransaction = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: tonAddress,
            amount: "1000000", // 0.001 TON in nanotons
          },
        ],
      };

      await tonConnectUI.sendTransaction(tonTransaction);
      setStatus('TON transaction sent, processing ETH transaction...');


      const client = await initializeLitClient();
      const txHash = await sendEthTransaction(ethAddress, client);
      
      setStatus(`Both transactions completed! ETH tx: ${txHash}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <TonConnectUIProvider manifestUrl="https://test-youtube.s3.amazonaws.com/manifest.json">
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">TON-ETH Bridge</h1>
            <TonConnectButton />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">TON Address</label>
              <input
                type="text"
                value={tonAddress}
                onChange={(e) => setTonAddress(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter TON address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ETH Address</label>
              <input
                type="text"
                value={ethAddress}
                onChange={(e) => setEthAddress(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter ETH address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount (TON)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter 0.001 TON"
                step="0.001"
              />
            </div>

            <button
              onClick={handleTransaction}
              disabled={!wallet || !tonAddress || !ethAddress || !amount}
              className={`w-full py-2 px-4 rounded-md text-white font-medium
                ${(!wallet || !tonAddress || !ethAddress || !amount)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Send Transactions
            </button>

            {status && (
              <div className={`p-4 rounded-md ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </TonConnectUIProvider>
  );
}

export default App;