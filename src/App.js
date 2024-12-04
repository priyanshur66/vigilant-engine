import React, { useState } from 'react';
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';

const PaymentForm = () => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const handlePayment = async () => {
    try {
      setStatus('Processing...');
      
      // Convert amount to nanotons (1 TON = 1_000_000_000 nanotons)
      const amountInNanotons = (parseFloat(amount) * 1000000000).toString();
      
      const transaction = {
        validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes
        messages: [
          {
            address: address,
            amount: amountInNanotons,
          },
        ],
      };

      const result = await tonConnectUI.sendTransaction(transaction);
      setStatus('Transaction sent successfully!');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Send TON</h2>
        <TonConnectButton />
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Address
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter TON wallet address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (TON)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in TON"
            min="0"
            step="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <button 
          onClick={handlePayment}
          disabled={!wallet || !address || !amount}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${(!wallet || !address || !amount) 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 transition-colors'}`}
        >
          Send Payment
        </button>

        {status && (
          <div className={`p-4 rounded-md ${
            status.includes('Error') 
              ? 'bg-red-100 text-red-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <TonConnectUIProvider manifestUrl="https://test-youtube.s3.amazonaws.com/manifest.json">
      <div className="min-h-screen bg-gray-100 py-8">
        <PaymentForm />
      </div>
    </TonConnectUIProvider>
  );
};

export default App;