import express from 'express';
import * as storage from '../services/storage.js';
import { ethers } from 'ethers';

const router = express.Router();

// Verify signature
async function verifySignature(address, message, signature) {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === address.toLowerCase();
  } catch (err) {
    return false;
  }
}

// GET /api/ubi/eligibility/:address
router.get('/ubi/eligibility/:address', (req, res) => {
  try {
    const { address } = req.params;
    res.json({
      address,
      eligible: true,
      eligibilityScore: 85,
      claimAmount: '85.00',
      nextClaimDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/ubi/request-claim
router.post('/ubi/request-claim', async (req, res) => {
  try {
    const { address, signature, message } = req.body;
    const valid = await verifySignature(address, message, signature);
    
    if (!valid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    res.json({
      claimId: `claim-${Date.now()}`,
      status: 'verified',
      amount: 85,
      message: 'UBI claim verified',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/transactions
router.get('/analytics/transactions', async (req, res) => {
  try {
    const { limit = 100, skip = 0, userAddress, type } = req.query;
    const filter = {};
    if (userAddress) filter.userAddress = userAddress;
    if (type) filter.type = type;

    const transactions = await storage.findTransactions(filter, Number(limit), Number(skip));
    const total = await storage.countTransactions(filter);

    res.json({ transactions, total, limit: Number(limit), skip: Number(skip) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/analytics/treasury
router.get('/analytics/treasury', async (req, res) => {
  try {
    const taxTxs = await storage.findTransactions({ type: 'tax' }, 10000, 0);
    const totalTax = taxTxs.reduce((sum, tx) => sum + (tx.taxAmount || 0), 0);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const lastWeekTax = taxTxs
      .filter(t => (t.timestamp || 0) >= oneWeekAgo)
      .reduce((sum, tx) => sum + (tx.taxAmount || 0), 0);

    res.json({
      totalTaxCollected: totalTax,
      transactionCount: await storage.countTransactions(),
      averageTransactionSize: totalTax / (taxTxs.length || 1),
      lastWeekTax,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/analytics/track-transaction
router.post('/analytics/track-transaction', async (req, res) => {
  try {
    const { txId, type, userAddress, amount, taxAmount, merchantAddress, merchantShare, onChainTxHash, metadata } = req.body;

    const txObj = {
      txId,
      type,
      userAddress: userAddress?.toLowerCase(),
      amount,
      taxAmount,
      merchantAddress: merchantAddress?.toLowerCase(),
      merchantShare,
      onChainTxHash: onChainTxHash || null,
      metadata: metadata || {},
      status: onChainTxHash ? 'confirmed' : 'pending',
      timestamp: Date.now(),
    };

    const saved = await storage.saveTransaction(txObj);

    res.json({
      transactionId: saved._id,
      status: saved.status,
      message: 'Transaction tracked successfully',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
