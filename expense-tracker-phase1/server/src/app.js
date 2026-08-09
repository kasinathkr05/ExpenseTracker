import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Loaded here to guarantee the DB connection + migrations run on startup.
import './db/database.js';

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Route modules are added here as each phase implements them, e.g.:
// import transactionsRouter from './routes/transactions.routes.js';
// app.use('/api/transactions', transactionsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Centralized error handler (kept minimal for now, expanded in later phases)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

export default app;
