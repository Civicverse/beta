// In-memory storage with optional MongoDB fallback
let TransactionModel = null;
let mongoAvailable = false;

const mem = {
  transactions: [],
  nextId: 1,
};

async function getTransactionModel() {
  try {
    if (!TransactionModel) {
      const mongoose = require('mongoose');
      if (mongoose.connection.readyState === 1) {
        TransactionModel = require('../models/transaction');
        mongoAvailable = true;
      }
    }
    return mongoAvailable ? TransactionModel : null;
  } catch (e) {
    return null;
  }
}

export async function saveTransaction(tx) {
  const Model = await getTransactionModel();
  if (Model) {
    const doc = new Model(tx);
    return await doc.save();
  }
  const copy = { ...tx, _id: String(mem.nextId++) };
  mem.transactions.unshift(copy);
  return copy;
}

export async function findTransactions(filter = {}, limit = 100, skip = 0) {
  const Model = await getTransactionModel();
  if (Model) {
    return await Model.find(filter).sort({ timestamp: -1 }).limit(limit).skip(skip);
  }
  let res = mem.transactions;
  if (filter.userAddress) res = res.filter(t => t.userAddress === filter.userAddress);
  if (filter.type) res = res.filter(t => t.type === filter.type);
  return res.slice(skip, skip + limit);
}

export async function countTransactions(filter = {}) {
  const Model = await getTransactionModel();
  if (Model) {
    return await Model.countDocuments(filter);
  }
  let res = mem.transactions;
  if (filter.userAddress) res = res.filter(t => t.userAddress === filter.userAddress);
  if (filter.type) res = res.filter(t => t.type === filter.type);
  return res.length;
}

export async function findPending(limit = 50) {
  const Model = await getTransactionModel();
  if (Model) {
    return await Model.find({ status: 'pending' }).limit(limit);
  }
  return mem.transactions.filter(t => t.status === 'pending').slice(0, limit);
}

export async function markConfirmedById(id) {
  const Model = await getTransactionModel();
  if (Model) {
    const tx = await Model.findById(id);
    if (tx) {
      tx.status = 'confirmed';
      await tx.save();
      return tx;
    }
  }
  const tx = mem.transactions.find(t => String(t._id) === String(id));
  if (tx) {
    tx.status = 'confirmed';
    return tx;
  }
  return null;
}
