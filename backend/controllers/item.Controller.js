import { Item } from '../models/item.js';
import mongoose from 'mongoose';

// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ itemID: 1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single item by itemID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({ itemID: req.params.id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    res.status(200).json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create a new item
export const createItem = async (req, res) => {
  try {
    const { code, name, price, quantity } = req.body;

    if (!code || !name || !price) {
      return res.status(400).json({ success: false, message: 'Code, name, and price are required' });
    }

    // Check if item with this code already exists
    const existingItem = await Item.findOne({ code });
    if (existingItem) {
      return res.status(400).json({ success: false, message: 'Item with this code already exists' });
    }

    // Find the highest existing itemID
    const highestItem = await Item.findOne({}, {itemID: 1}, {sort: {itemID: -1}});
    let nextId = 1;

    if (highestItem && highestItem.itemID) {
      const idNumber = parseInt(highestItem.itemID.replace('ITM', ''));
      nextId = idNumber + 1;
    }

    const item = new Item({
      itemID: `ITM${nextId.toString().padStart(3, '0')}`,
      code,
      name,
      price,
      quantity: quantity || 0
    });

    await item.save();

    res.status(201).json({ success: true, message: 'Item created successfully', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update an item
export const updateItem = async (req, res) => {
  try {
    const { code, name, price, quantity } = req.body;

    // Check if changing code and if new code already exists
    if (code) {
      const item = await Item.findOne({ itemID: req.params.id });
      if (item && item.code !== code) {
        const existingItem = await Item.findOne({ code });
        if (existingItem) {
          return res.status(400).json({ success: false, message: 'Item with this code already exists' });
        }
      }
    }

    const item = await Item.findOneAndUpdate(
      { itemID: req.params.id },
      { code, name, price, quantity },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, message: 'Item updated successfully', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete an item and reorder IDs
export const deleteItem = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find the item to delete
    const itemToDelete = await Item.findOne({ itemID: req.params.id }).session(session);

    if (!itemToDelete) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // Get the numeric part of the itemID
    const deletedIdNumber = parseInt(itemToDelete.itemID.replace('ITM', ''));

    // Delete the item
    await Item.findOneAndDelete({ itemID: req.params.id }).session(session);

    // Find all items with higher IDs
    const itemsToUpdate = await Item.find({}).session(session);

    // Filter and sort items with higher IDs
    const higherIdItems = itemsToUpdate
      .filter(item => {
        const idNumber = parseInt(item.itemID.replace('ITM', ''));
        return idNumber > deletedIdNumber;
      })
      .sort((a, b) => {
        const aIdNumber = parseInt(a.itemID.replace('ITM', ''));
        const bIdNumber = parseInt(b.itemID.replace('ITM', ''));
        return aIdNumber - bIdNumber; // Sort in ascending order
      });

    // Update each item's ID
    for (const item of higherIdItems) {
      const currentIdNumber = parseInt(item.itemID.replace('ITM', ''));
      const newIdNumber = currentIdNumber - 1;
      const newItemID = `ITM${newIdNumber.toString().padStart(3, '0')}`;

      await Item.findByIdAndUpdate(
        item._id,
        { itemID: newItemID },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully and IDs reorganized'
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search items by name or code
export const searchItems = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Case-insensitive search for name or code
    const items = await Item.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { code: { $regex: query, $options: 'i' } }
      ]
    }).sort({ itemID: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
