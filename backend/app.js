const express = require('express');
const bodyParser = require('body-parser');

const eventRoutes = require('./routes/events');
const authRoutes = require('./routes/auth');

const app = express();

/* Parse incoming JSON bodies */
app.use(bodyParser.json());

/* CORS configuration */
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
  ];
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Max-Age', '600');

  /* Handle preflight requests */
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

/* Routes */
app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

/* Global error handler */
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong.';
  res.status(status).json({ message });
});

/* Start server */
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
