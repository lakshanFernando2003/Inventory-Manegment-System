import express from 'express';
import {  getAllItems, getItemById, createItem, updateItem, deleteItem} from '../controllers/item.Controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// CRUD routes
router.get('/Items', getAllItems);
router.get('/Item/:id', getItemById);
router.post('/New-Item', createItem);
router.put('/Item/:id', updateItem);
router.delete('/Item/:id', deleteItem);

export default router;
