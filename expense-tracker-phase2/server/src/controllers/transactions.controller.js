import * as transactionsService from '../services/transactions.service.js';

/**
 * Controllers are the "middlemen": they read what the request is
 * asking for, call the correct service function, and send back a
 * response. They don't contain any SQL themselves.
 */

export function getAllTransactions(req, res) {
  const { type, category, from, to } = req.query;
  const transactions = transactionsService.getAllTransactions({ type, category, from, to });
  res.json(transactions);
}

export function getTransactionById(req, res) {
  const transaction = transactionsService.getTransactionById(req.params.id);

  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json(transaction);
}

export function createTransaction(req, res) {
  const { type, amount, category, description, date } = req.body;

  const transaction = transactionsService.createTransaction({
    type,
    amount: Number(amount),
    category: category.trim(),
    description: description?.trim(),
    date,
  });

  res.status(201).json(transaction);
}

export function updateTransaction(req, res) {
  const { type, amount, category, description, date } = req.body;

  const updated = transactionsService.updateTransaction(req.params.id, {
    type,
    amount: Number(amount),
    category: category.trim(),
    description: description?.trim(),
    date,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.json(updated);
}

export function deleteTransaction(req, res) {
  const deleted = transactionsService.deleteTransaction(req.params.id);

  if (!deleted) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  res.status(204).send();
}
