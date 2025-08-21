import { Order } from '../models/order.js';
import { Item } from '../models/item.js';
import { Customer } from '../models/customer.js';
import mongoose from 'mongoose';

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ orderID: 1 })
      .populate('customer', 'custID name')
      .populate('items.item', 'itemID name');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single order by orderID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ orderID: req.params.id })
      .populate('customer', 'custID name')
      .populate('items.item', 'itemID name');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerID, items } = req.body;

    if (!customerID || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Customer ID and items are required' });
    }

    // Validate customer exists
    const customer = await Customer.findOne({ custID: customerID }).session(session);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Process items and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const { itemID, quantity } = item;

      // Validate item exists
      const dbItem = await Item.findOne({ itemID }).session(session);
      if (!dbItem) {
        return res.status(404).json({ success: false, message: `Item ${itemID} not found` });
      }

      // Check sufficient stock
      if (dbItem.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${dbItem.name}. Available: ${dbItem.quantity}`
        });
      }

      // Update stock
      dbItem.quantity -= quantity;
      await dbItem.save({ session });

      // Add to order items
      const itemTotal = dbItem.price * quantity;
      totalAmount += itemTotal;

      orderItems.push({
        item: dbItem._id,
        itemID: dbItem.itemID,
        quantity,
        price: dbItem.price
      });
    }

    // Find the highest existing orderID
    const highestOrder = await Order.findOne({}, {orderID: 1}, {sort: {orderID: -1}});
    let nextId = 1;

    if (highestOrder && highestOrder.orderID) {
      const idNumber = parseInt(highestOrder.orderID.replace('ORD', ''));
      nextId = idNumber + 1;
    }

    // Create the order
    const order = new Order({
      orderID: `ORD${nextId.toString().padStart(3, '0')}`,
      customer: customer._id,
      customerID: customer.custID,
      items: orderItems,
      totalAmount
    });

    await order.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an order and reorder IDs
export const deleteOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the order to delete
    const orderToDelete = await Order.findOne({ orderID: req.params.id }).session(session);

    if (!orderToDelete) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Restore item quantities
    for (const orderItem of orderToDelete.items) {
      const item = await Item.findById(orderItem.item).session(session);
      if (item) {
        item.quantity += orderItem.quantity;
        await item.save({ session });
      }
    }

    // Get the numeric part of the orderID
    const deletedIdNumber = parseInt(orderToDelete.orderID.replace('ORD', ''));

    // Delete the order
    await Order.findOneAndDelete({ orderID: req.params.id }).session(session);

    // Find all orders with higher IDs
    const ordersToUpdate = await Order.find({}).session(session);

    // Filter and sort orders with higher IDs
    const higherIdOrders = ordersToUpdate
      .filter(order => {
        const idNumber = parseInt(order.orderID.replace('ORD', ''));
        return idNumber > deletedIdNumber;
      })
      .sort((a, b) => {
        const aIdNumber = parseInt(a.orderID.replace('ORD', ''));
        const bIdNumber = parseInt(b.orderID.replace('ORD', ''));
        return aIdNumber - bIdNumber; // Sort in ascending order
      });

    // Update each order's ID
    for (const order of higherIdOrders) {
      const currentIdNumber = parseInt(order.orderID.replace('ORD', ''));
      const newIdNumber = currentIdNumber - 1;
      const newOrderID = `ORD${newIdNumber.toString().padStart(3, '0')}`;

      await Order.findByIdAndUpdate(
        order._id,
        { orderID: newOrderID },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully and IDs reorganized'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};
