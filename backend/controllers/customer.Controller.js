import { Customer } from '../models/customer.js';

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    res.status(200).json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new customer
export const createCustomer = async (req, res) => {
  try {
    const { name, nic, address, contactNo } = req.body;

    if (!name || !address) {
      return res.status(400).json({ success: false, message: 'Name and address are required' });
    }

    const customer = new Customer({ name, nic, address, contactNo });
    await customer.save();

    res.status(201).json({ success: true, message: 'Customer created successfully', customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  try {
    const { name, nic, address, contactNo } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, nic, address, contactNo },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({ success: true, message: 'Customer updated successfully', customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.status(200).json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
