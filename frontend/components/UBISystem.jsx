import React, { useState, useEffect } from 'react';
import './UBISystem.css';

const UBISystem = () => {
  const [ubiData, setUbiData] = useState(null);
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');

  const fetchEligibility = async () => {
    const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    // In demo mode, return mock data
    setUbiData({
      address: mockAddress,
      eligible: true,
      eligibilityScore: 85,
      claimAmount: '85.00',
      nextClaimDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    });
  };

  const handleClaim = async () => {
    setClaiming(true);
    setClaimMessage('Processing UBI claim...');
    
    // Simulate claim
    setTimeout(() => {
      setClaimMessage('✅ UBI Claim Verified! 85 tokens have been added to your account.');
      setClaiming(false);
    }, 2000);
  };

  useEffect(() => {
    fetchEligibility();
  }, []);

  return (
    <div className="ubi-panel">
      <h2>💰 Universal Basic Income</h2>
      
      {ubiData && (
        <div className="ubi-content">
          <div className="ubi-info">
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`badge ${ubiData.eligible ? 'eligible' : 'ineligible'}`}>
                {ubiData.eligible ? '✓ Eligible' : '✗ Not Eligible'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="label">Eligibility Score:</span>
              <span className="value">{ubiData.eligibilityScore}/100</span>
            </div>
            
            <div className="info-item">
              <span className="label">Claimable Amount:</span>
              <span className="amount">{ubiData.claimAmount} VOTE</span>
            </div>
            
            <div className="info-item">
              <span className="label">Next Claim Available:</span>
              <span className="value">{ubiData.nextClaimDate}</span>
            </div>
          </div>

          {ubiData.eligible && (
            <button 
              className="claim-btn" 
              onClick={handleClaim}
              disabled={claiming}
            >
              {claiming ? 'Processing...' : 'Claim UBI'}
            </button>
          )}

          {claimMessage && (
            <div className="claim-message">
              {claimMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UBISystem;
