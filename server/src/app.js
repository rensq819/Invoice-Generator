import express from 'express';
import mongoose from 'mongoose';
import logger from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';
import cors from 'cors';
import { restRouter } from './api/index.js';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/invoice-builder');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); //bodyParser
app.use(express.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true
  })
);
app.use('/api', restRouter);
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: { message: error.message }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});
