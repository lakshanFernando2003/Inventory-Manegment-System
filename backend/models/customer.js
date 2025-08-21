import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  custID: {
    type: String,
    unique: true,
    required: true
  },
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

// Pre-save hook to generate custID
customerSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Find the highest existing custID
    const highestCustomer = await this.constructor.findOne({}, {custID: 1}, {sort: {custID: -1}});
    let nextId = 1001;

    if (highestCustomer && highestCustomer.custID) {
      // Extract the number part and increment it
      const idNumber = parseInt(highestCustomer.custID.replace('CID', ''));
      nextId = idNumber + 1;
    }

    this.custID = `CID${nextId}`;
  }
  next();
});

export const Customer = mongoose.model('Customer', customerSchema);
