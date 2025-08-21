import { Order } from '../models/order.js';
import { Item } from '../models/item.js';
import { Customer } from '../models/customer.js';

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('customer', 'name')
      .populate('items.item', 'name code');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name contactNo address')
      .populate('items.item', 'name code price');

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
  try {
    const { customerId, items } = req.body;

    if (!customerId || !items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Customer ID and at least one item are required'
      });
    }

    // Validate customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Process items and calculate total
    let totalPrice = 0;
    const orderItems = [];

    for (const orderItem of items) {
      const { itemId, quantity } = orderItem;

      if (!itemId || !quantity) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have an ID and quantity'
        });
      }

      // Find the item in database
      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item with ID ${itemId} not found`
        });
      }

      // Check if enough quantity in stock
      if (item.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough ${item.name} in stock. Available: ${item.quantity}`
        });
      }

      // Calculate item total price
      const itemTotal = item.price * quantity;
      totalPrice += itemTotal;

      // Add to order items
      orderItems.push({
        item: itemId,
        quantity,
        price: item.price
      });

      // Update inventory
      item.quantity -= quantity;
      await item.save();
    }

    // Create the order
    const order = new Order({
      customer: customerId,
      items: orderItems,
      totalPrice
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: await Order.findById(order._id)
        .populate('customer', 'name')
        .populate('items.item', 'name code')
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an order (for admin purposes)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Restore inventory quantities
    for (const orderItem of order.items) {
      const item = await Item.findById(orderItem.item);
      if (item) {
        item.quantity += orderItem.quantity;
        await item.save();
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
