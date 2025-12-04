import React, { useState } from 'react';
import ThreeGame from './components/ThreeGame';
import ShopSystem from './components/ShopSystem';
import UBISystem from './components/UBISystem';
import './App.css';

function App() {
  const [showShop, setShowShop] = useState(false);
  const [showUBI, setShowUBI] = useState(false);
  const [receipts, setReceipts] = useState([]);

  const handleShopInteract = () => {
    setShowShop(true);
  };

  const handleCheckout = (receiptData) => {
    setReceipts([receiptData, ...receipts]);
  };

  return (
    <div className="app">
      <ThreeGame onShopInteract={handleShopInteract} />
      
      <div className="ui-overlay">
        <div className="top-bar">
          <h1>🎮 CivicVerse</h1>
          <div className="top-buttons">
            <button 
              className="btn-secondary"
              onClick={() => setShowUBI(!showUBI)}
            >
              💰 UBI
            </button>
            <button 
              className="btn-secondary"
              onClick={() => setShowShop(true)}
            >
              🛒 Shop
            </button>
          </div>
        </div>

        {showUBI && (
          <div className="ubi-container">
            <UBISystem />
          </div>
        )}

        <div className="receipts-container">
          <h3>📜 Recent Transactions ({receipts.length})</h3>
          <div className="receipts-list">
            {receipts.slice(0, 5).map((receipt, idx) => (
              <div key={idx} className="receipt-item-mini">
                <span className="tx-id">{receipt.txId}</span>
                <span className="tx-amount">${receipt.total}</span>
                <span className="tx-time">{receipt.timestamp}</span>
              </div>
            ))}
            {receipts.length === 0 && (
              <p className="no-transactions">No transactions yet</p>
            )}
          </div>
        </div>
      </div>

      {showShop && (
        <ShopSystem 
          onClose={() => setShowShop(false)}
          onCheckout={handleCheckout}
        />
      )}

      <div className="hud-info">
        <div className="hud-item">
          <span>Controls:</span>
          <span>WASD or Arrow Keys to move • Click to shop</span>
        </div>
        <div className="hud-item">
          <span>Wallet:</span>
          <span>Demo Mode (No private key required)</span>
        </div>
      </div>
    </div>
  );
}

export default App;
