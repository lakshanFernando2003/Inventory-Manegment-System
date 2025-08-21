import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  itemID: {
    type: String,
    unique: true,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Pre-save hook to generate itemID
itemSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Find the highest existing itemID
    const highestItem = await this.constructor.findOne({}, {itemID: 1}, {sort: {itemID: -1}});
    let nextId = 1;

    if (highestItem && highestItem.itemID) {
      // Extract the number part and increment it
      const idNumber = parseInt(highestItem.itemID.replace('ITM', ''));
      nextId = idNumber + 1;
    }

    // Format with leading zeros (e.g., ITM001, ITM002)
    this.itemID = `ITM${nextId.toString().padStart(3, '0')}`;
  }
  next();
});

export const Item = mongoose.model('Item', itemSchema);
