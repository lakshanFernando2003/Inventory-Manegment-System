import express from 'express';
import { getAllItems, getItemById, createItem, updateItem, deleteItem, searchItems } from '../controllers/item.Controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/Items', verifyToken, getAllItems);
router.get('/Item/:id', verifyToken, getItemById);
router.post('/newItem', verifyToken, createItem);
router.put('/updateItem/:id', verifyToken, updateItem);
router.delete('/deleteItem/:id', verifyToken, deleteItem);
router.get('/searchItems', verifyToken, searchItems);

export default router;
