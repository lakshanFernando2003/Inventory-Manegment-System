import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nic: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
  },
}, { timestamps: true });

export const Customer = mongoose.model('Customer', customerSchema);
