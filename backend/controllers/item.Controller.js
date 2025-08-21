import { Item } from '../models/item.js';

// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single item by ID
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
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

    const item = new Item({ code, name, price, quantity });
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
      const item = await Item.findById(req.params.id);
      if (item && item.code !== code) {
        const existingItem = await Item.findOne({ code });
        if (existingItem) {
          return res.status(400).json({ success: false, message: 'Item with this code already exists' });
        }
      }
    }

    const item = await Item.findByIdAndUpdate(
      req.params.id,
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

// Delete an item
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
