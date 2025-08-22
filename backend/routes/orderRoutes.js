import express from 'express';
import { getAllOrders, getOrderById, createOrder, deleteOrder, updateOrderStatus } from '../controllers/order.Controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Order routes
router.get('/Orders', getAllOrders);
router.get('/Order/:id', getOrderById);
router.post('/New-Order', createOrder);
router.delete('/Order/:id', deleteOrder);
router.put('/Order-Status/:id', updateOrderStatus);

export default router;
