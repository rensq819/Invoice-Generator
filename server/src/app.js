import express from 'express';
import mongoose from 'mongoose';
import { router } from './config/routes';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/invoice-builder');

const app = express();
const PORT = 3000;

app.use('/api', router);
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.message = 'Invalid route';
  error.statue = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: { message: error.message }
  });
});

const invoices = [
  {
    _id: '1234',
    item: 'Amazon Product',
    qty: '12',
    date: new Date()
  },
  {
    _id: '2345',
    item: 'Google Product',
    qty: '12',
    date: new Date()
  },
  {
    _id: '3456',
    item: 'Linked Product',
    qty: '12',
    date: new Date()
  }
];

app.get('/invoices', (req, res) => {
  res.json(invoices);
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
