import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import WebApp from '@twa-dev/sdk';
import { TransactionProvider } from './context/TransactionContext';
import { TonConnectUIProvider } from "@tonconnect/ui-react";

WebApp.ready();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/JettonFactory/JettonFactory.github.io/main/tonconnect-manifest.json">
    <React.StrictMode>
      <TransactionProvider>
        <App />
      </TransactionProvider>
    </React.StrictMode>
  </TonConnectUIProvider>

);
