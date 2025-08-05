const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pool = require('./db');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes'); 
const authenticateToken = require('./authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes); 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
