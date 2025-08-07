const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [50, 'Customer name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
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
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    cost: {
      type: Number,
      default: 0
    },
    profit: {
      type: Number,
      default: 0
    }
  }],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  subtotal: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  profitMargin: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Progress', 'Ready', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  specialInstructions: {
    type: String,
    maxlength: [500, 'Special instructions cannot exceed 500 characters']
  },
  pickupTime: {
    type: Date
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  tags: [{
    type: String,
    enum: ['VIP', 'Rush', 'Special', 'Bulk', 'First Time', 'Returning']
  }],
  source: {
    type: String,
    enum: ['Website', 'Phone', 'Walk-in', 'Social Media'],
    default: 'Website'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate profit and margins before saving
orderSchema.pre('save', function(next) {
  // Calculate total cost and profit
  this.totalCost = this.items.reduce((sum, item) => sum + (item.cost * item.quantity), 0);
  this.totalProfit = this.total - this.totalCost;
  this.profitMargin = this.total > 0 ? (this.totalProfit / this.total) * 100 : 0;
  
  // Update timestamp
  this.updatedAt = new Date();
  next();
});

// Index for analytics queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ customerId: 1 });
orderSchema.index({ total: 1 });
orderSchema.index({ 'items.productId': 1 });

module.exports = mongoose.model('Order', orderSchema);
