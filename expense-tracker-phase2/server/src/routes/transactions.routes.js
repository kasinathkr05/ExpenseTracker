import { Router } from 'express';
import * as transactionsController from '../controllers/transactions.controller.js';
import { validateTransaction } from '../middleware/validateTransaction.js';

const router = Router();

// GET    /api/transactions       -> list all (supports ?type=&category=&from=&to=)
// GET    /api/transactions/:id   -> get one
// POST   /api/transactions       -> create one (validated)
// PUT    /api/transactions/:id   -> update one (validated)
// DELETE /api/transactions/:id   -> delete one

router.get('/', transactionsController.getAllTransactions);
router.get('/:id', transactionsController.getTransactionById);
router.post('/', validateTransaction, transactionsController.createTransaction);
router.put('/:id', validateTransaction, transactionsController.updateTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

export default router;
