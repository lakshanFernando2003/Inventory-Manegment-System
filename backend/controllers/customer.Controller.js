import { Customer } from '../models/customer.js';
import mongoose from 'mongoose';

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ custID: 1 });
    res.status(200).json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single customer by custID
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ custID: req.params.id });
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

    if (!name || !address || !nic) {
      return res.status(400).json({ success: false, message: 'Name, NIC, and address are required' });
    }

    // Step 1: Find the highest existing custID outside the pre-save hook
    const highestCustomer = await Customer.findOne({}, {custID: 1}, {sort: {custID: -1}});
    let nextId = 1001;

    if (highestCustomer && highestCustomer.custID) {
      // Extract the number part and increment it
      const idNumber = parseInt(highestCustomer.custID.replace('CID', ''));
      nextId = idNumber + 1;
    }

    // Step 2: Create customer with custID already set
    const customer = new Customer({
      custID: `CID${nextId}`,
      name,
      nic,
      address,
      contactNo
    });

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
    const customer = await Customer.findOneAndUpdate(
      { custID: req.params.id },
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

// Delete a customer and reorder IDs
export const deleteCustomer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the customer to delete
    const customerToDelete = await Customer.findOne({ custID: req.params.id }).session(session);

    if (!customerToDelete) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Get the numeric part of the custID
    const deletedIdNumber = parseInt(customerToDelete.custID.replace('CID', ''));

    // Delete the customer
    await Customer.findOneAndDelete({ custID: req.params.id }).session(session);

    // Find all customers with higher IDs
    const customersToUpdate = await Customer.find({}).session(session);

    // Filter and sort customers with higher IDs
    const higherIdCustomers = customersToUpdate
      .filter(customer => {
        const idNumber = parseInt(customer.custID.replace('CID', ''));
        return idNumber > deletedIdNumber;
      })
      .sort((a, b) => {
        const aIdNumber = parseInt(a.custID.replace('CID', ''));
        const bIdNumber = parseInt(b.custID.replace('CID', ''));
        return aIdNumber - bIdNumber; // Sort in ascending order
      });

    // Update each customer's ID
    for (const customer of higherIdCustomers) {
      const currentIdNumber = parseInt(customer.custID.replace('CID', ''));
      const newIdNumber = currentIdNumber - 1;
      const newCustID = `CID${newIdNumber}`;

      await Customer.findByIdAndUpdate(
        customer._id,
        { custID: newCustID },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully and IDs reorganized'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};
