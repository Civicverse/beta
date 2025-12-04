import { ethers } from 'ethers';
import * as storage from './storage.js';

let provider;

export function initPoller() {
  const rpc = process.env.ETH_RPC || 'http://127.0.0.1:8545';
  provider = new ethers.JsonRpcProvider(rpc);
  console.log('On-chain poller using RPC:', rpc);

  setInterval(checkPendingTransactions, Number(process.env.POLLER_INTERVAL_MS) || 5000);
}

export async function checkPendingTransactions() {
  try {
    const pending = await storage.findPending(50);
    if (!pending || !pending.length) return;

    const demoMode = process.env.DEMO_MODE === 'true';

    for (const tx of pending) {
      if (tx.onChainTxHash) {
        try {
          const receipt = await provider.getTransactionReceipt(tx.onChainTxHash);
          if (receipt && receipt.blockNumber) {
            await storage.markConfirmedById(tx._id);
            console.log('Marked tx confirmed:', tx.txId, tx.onChainTxHash);
          }
        } catch (e) {
          // ignore
        }
      } else if (demoMode) {
        await storage.markConfirmedById(tx._id);
        console.log('Demo-mode: auto-confirmed tx:', tx.txId);
      }
    }
  } catch (err) {
    console.error('Poller error:', err.message || err);
  }
}
