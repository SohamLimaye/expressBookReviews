const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const generalRoutes = require('./router/general').general;
const authRoutes = require('./router/auth_users').authenticated;

const app = express();

app.use(bodyParser.json());
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

app.use('/customer', authRoutes);
app.use('/', generalRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});