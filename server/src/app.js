import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.json({
    msg: 'Welcome to Invoice Backend',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at port: ${PORT}`);
});