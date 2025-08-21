import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  itemID: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderID: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  customerID: {
    type: String,
    required: true
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

// Pre-save hook to generate orderID
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Find the highest existing orderID
    const highestOrder = await this.constructor.findOne({}, {orderID: 1}, {sort: {orderID: -1}});
    let nextId = 1;

    if (highestOrder && highestOrder.orderID) {
      // Extract the number part and increment it
      const idNumber = parseInt(highestOrder.orderID.replace('ORD', ''));
      nextId = idNumber + 1;
    }

    // Format with leading zeros (e.g., ORD001, ORD002)
    this.orderID = `ORD${nextId.toString().padStart(3, '0')}`;
  }
  next();
});

export const Order = mongoose.model('Order', orderSchema);
