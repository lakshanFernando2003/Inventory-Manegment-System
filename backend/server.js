import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http'; // Import HTTP


import { connectDB } from './DataBase/ConnectDB.js';
import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import dashboardRoutes from './routes/DashboardRoutes.js';


// Environment configuration
dotenv.config();

const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser()); // to allow us parse incoming cookies

const port = process.env.PORT || 5000;
// Create HTTP server using Express app
const server = http.createServer(app);


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

app.use("/api/auth", authRoutes);
app.use('/api', customerRoutes);
app.use('/api', itemRoutes);
app.use('/api', orderRoutes);
app.use("/api", dashboardRoutes);

server.listen(port, () => {
  connectDB();
  console.log(`Server is now running on port ${port}`);
});


// lAElQPPTO0vyxUdP password
// lakshanchanaka34 username

//mongodb+srv://lakshanchanaka34:lAElQPPTO0vyxUdP@inventory-db.weiodt8.mongodb.net/?retryWrites=true&w=majority&appName=inventory-DB
