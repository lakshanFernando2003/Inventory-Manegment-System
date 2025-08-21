import express from 'express';
import {getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer} from '../controllers/customer.Controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/Customers', verifyToken, getAllCustomers);
router.get('/Customer/:id', verifyToken, getCustomerById);
router.post('/newCustomer', verifyToken, createCustomer);
router.put('/updateCustomer/:id', verifyToken, updateCustomer);
router.delete('/deleteCustomer/:id', verifyToken, deleteCustomer);

export default router;
