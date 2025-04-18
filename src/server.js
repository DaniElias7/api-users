import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import route handlers
import authRoutes from './routes/auth.routes.js'; 
import userRoutes from './routes/user.routes.js'; 

import './models/user.model.js'; // This executes the model file, initializing the in-memory DB

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000' // Allow requests only from this origin
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', userRoutes);

const port = process.env.PORT || 5000; 

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
