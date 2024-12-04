import logo from './logo.svg';
import './App.css';
import { TonConnectButton, TonConnectUIProvider } from '@tonconnect/ui-react';

function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://test-youtube.s3.amazonaws.com/manifest.json">
      <div className="App">
     <TonConnectButton >TonConnectButton</TonConnectButton>  
      </div>  </TonConnectUIProvider>

  );
}

export default App;
