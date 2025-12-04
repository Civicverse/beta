import React, { useState, useEffect } from 'react';
import './ShopSystem.css';

const ShopSystem = ({ onClose, onCheckout }) => {
  const [cart, setCart] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const items = [
    { id: 1, name: 'Neon Sword', price: 100 },
    { id: 2, name: 'Glow Shield', price: 75 },
    { id: 3, name: 'Plasma Boots', price: 50 },
    { id: 4, name: 'Circuit Armor', price: 120 },
    { id: 5, name: 'Energy Crystal', price: 60 },
  ];

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleCheckout = async () => {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const tax = Math.ceil(total * 0.01);

    const receiptData = {
      txId: `tx-${Date.now()}`,
      items: cart,
      subtotal: total,
      tax,
      total: total + tax,
      timestamp: new Date().toLocaleString(),
      status: 'confirmed',
    };

    setReceipt(receiptData);
    setShowReceipt(true);
    setCart([]);

    // Call parent callback
    onCheckout?.(receiptData);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const tax = Math.ceil(totalPrice * 0.01);

  return (
    <div className="shop-overlay">
      <div className="shop-modal">
        <button className="close-btn" onClick={onClose}>✕</button>
        
        {!showReceipt ? (
          <>
            <h1>🛒 Neon Shop</h1>
            
            <div className="shop-content">
              <div className="items-list">
                <h2>Available Items</h2>
                {items.map((item) => (
                  <div key={item.id} className="shop-item">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="price">${item.price}</p>
                    </div>
                    <button onClick={() => addToCart(item)}>Add to Cart</button>
                  </div>
                ))}
              </div>

              <div className="cart-section">
                <h2>Cart ({cart.length})</h2>
                <div className="cart-items">
                  {cart.length === 0 ? (
                    <p className="empty">Cart is empty</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className="cart-item">
                        <span>{item.name} - ${item.price}</span>
                        <button onClick={() => removeFromCart(idx)}>Remove</button>
                      </div>
                    ))
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="checkout-summary">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>${totalPrice}</span>
                    </div>
                    <div className="summary-row tax">
                      <span>Tax (1%):</span>
                      <span>${tax}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>${totalPrice + tax}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout}>
                      Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>✅ Receipt</h1>
            <div className="receipt-content">
              <div className="receipt-item">
                <span>Transaction ID:</span>
                <span className="mono">{receipt.txId}</span>
              </div>
              <div className="receipt-item">
                <span>Items:</span>
                <span>{receipt.items.map(i => i.name).join(', ')}</span>
              </div>
              <div className="receipt-item">
                <span>Subtotal:</span>
                <span>${receipt.subtotal}</span>
              </div>
              <div className="receipt-item highlight">
                <span>Tax to Multisig (1%):</span>
                <span>${receipt.tax}</span>
              </div>
              <div className="receipt-item total">
                <span>Total Paid:</span>
                <span>${receipt.total}</span>
              </div>
              <div className="receipt-item">
                <span>Timestamp:</span>
                <span>{receipt.timestamp}</span>
              </div>
              <div className="receipt-item">
                <span>Status:</span>
                <span className="status-badge">{receipt.status}</span>
              </div>
              <button className="continue-btn" onClick={() => {
                setShowReceipt(false);
                onClose();
              }}>
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShopSystem;
