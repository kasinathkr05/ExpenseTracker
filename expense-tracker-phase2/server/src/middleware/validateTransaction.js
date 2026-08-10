/**
 * Checks the body of a POST/PUT /api/transactions request before it
 * ever reaches the controller or database. If something is wrong, it
 * responds with 400 and a clear message and stops the request there
 * (it never calls next()). If everything looks good, it calls next()
 * so the request continues to the controller.
 */
export function validateTransaction(req, res, next) {
  const { type, amount, category, date } = req.body;
  const errors = [];

  if (type !== 'income' && type !== 'expense') {
    errors.push('type must be either "income" or "expense"');
  }

  const numericAmount = Number(amount);
  if (amount === undefined || amount === null || amount === '' || Number.isNaN(numericAmount) || numericAmount <= 0) {
    errors.push('amount must be a positive number');
  }

  if (!category || typeof category !== 'string' || !category.trim()) {
    errors.push('category is required');
  }

  if (!date || typeof date !== 'string' || Number.isNaN(Date.parse(date))) {
    errors.push('date is required and must be a valid date');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  next();
}
