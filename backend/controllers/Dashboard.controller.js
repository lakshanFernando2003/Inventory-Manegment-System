import { Customer } from '../models/customer.js';
import { Item } from '../models/item.js';
import { Order } from '../models/order.js';

export const getDashboardStats = async (req, res) => {
  try {
    // Basic counts
    const customerCount = await Customer.countDocuments();
    const itemCount = await Item.countDocuments();
    const orderCount = await Order.countDocuments();

    // Order status counts
    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });
    const completedOrdersCount = await Order.countDocuments({ status: 'completed' });
    const cancelledOrdersCount = await Order.countDocuments({ status: 'cancelled' });

    // Calculate total sales amount (from completed orders)
    const salesData = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].total : 0;

    // Get low stock items (less than 10 in quantity)
    const lowStockItems = await Item.find({ quantity: { $lt: 10 } })
      .select('itemID name code quantity price')
      .sort({ quantity: 1 })
      .limit(5);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customer', 'custID name')
      .select('orderID customerID totalAmount status createdAt');

    // Get total inventory value
    const inventoryData = await Item.aggregate([
      { $group: { _id: null, value: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    ]);

    const inventoryValue = inventoryData.length > 0 ? inventoryData[0].value : 0;

    res.status(200).json({
      success: true,
      data: {
        counts: {
          customers: customerCount,
          items: itemCount,
          orders: orderCount,
          pendingOrders: pendingOrdersCount,
          completedOrders: completedOrdersCount,
          cancelledOrders: cancelledOrdersCount,
        },
        totalSales,
        inventoryValue,
        lowStockItems,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
