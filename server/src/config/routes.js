import express from 'express';
import invoiceController from '../api/resources/invoice/invoice.controller'
export const router = express.Router();

// Invoices
router.get('/invoices', invoiceController.findAll);
router.get('/invoices/:id', invoiceController.findOne);
router.post('/invoices', invoiceController.create);
router.put('/invoices/:id', invoiceController.update);
router.delete('/invoices/:id', invoiceController.delete)
