import db from '../db/database.js';

/**
 * This file is the only place in the app that writes raw SQL for
 * transactions. Controllers never talk to the database directly —
 * they call these functions instead. That way, if we ever change how
 * data is stored, we only have to update this one file.
 */

const insertStmt = db.prepare(`
  INSERT INTO transactions (type, amount, category, description, date)
  VALUES (@type, @amount, @category, @description, @date)
`);

const selectByIdStmt = db.prepare(`
  SELECT * FROM transactions WHERE id = ?
`);

const updateStmt = db.prepare(`
  UPDATE transactions
  SET type = @type,
      amount = @amount,
      category = @category,
      description = @description,
      date = @date,
      updated_at = datetime('now')
  WHERE id = @id
`);

const deleteStmt = db.prepare(`
  DELETE FROM transactions WHERE id = ?
`);

/**
 * Returns all transactions, optionally filtered by type/category/date range.
 * Filters are all optional — pass an empty object to get everything.
 */
export function getAllTransactions({ type, category, from, to } = {}) {
  let query = 'SELECT * FROM transactions WHERE 1 = 1';
  const params = {};

  if (type) {
    query += ' AND type = @type';
    params.type = type;
  }
  if (category) {
    query += ' AND category = @category';
    params.category = category;
  }
  if (from) {
    query += ' AND date >= @from';
    params.from = from;
  }
  if (to) {
    query += ' AND date <= @to';
    params.to = to;
  }

  query += ' ORDER BY date DESC, id DESC';

  return db.prepare(query).all(params);
}

export function getTransactionById(id) {
  return selectByIdStmt.get(id);
}

export function createTransaction({ type, amount, category, description, date }) {
  const result = insertStmt.run({
    type,
    amount,
    category,
    description: description ?? null,
    date,
  });
  return getTransactionById(result.lastInsertRowid);
}

/**
 * Returns the updated row, or undefined if no transaction with that id exists.
 */
export function updateTransaction(id, { type, amount, category, description, date }) {
  const existing = getTransactionById(id);
  if (!existing) return undefined;

  updateStmt.run({
    id,
    type,
    amount,
    category,
    description: description ?? null,
    date,
  });
  return getTransactionById(id);
}

/**
 * Returns true if a row was deleted, false if no transaction with that id existed.
 */
export function deleteTransaction(id) {
  const result = deleteStmt.run(id);
  return result.changes > 0;
}
