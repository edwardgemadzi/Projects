const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    }
  },
  preferences: {
    favoriteCategories: [String],
    dietaryRestrictions: [String],
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'sms'],
      default: 'email'
    },
    newsletterSubscription: {
      type: Boolean,
      default: true
    },
    specialOffers: {
      type: Boolean,
      default: true
    }
  },
  loyalty: {
    points: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze'
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    averageOrderValue: {
      type: Number,
      default: 0
    },
    lastOrderDate: Date,
    firstOrderDate: Date
  },
  tags: [{
    type: String,
    enum: ['VIP', 'Regular', 'New', 'Returning', 'High-Value', 'Seasonal', 'Special']
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'VIP', 'Blocked'],
    default: 'Active'
  },
  source: {
    type: String,
    enum: ['Website', 'Walk-in', 'Referral', 'Social Media', 'Phone'],
    default: 'Website'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for analytics queries
customerSchema.index({ 'loyalty.totalSpent': -1 });
customerSchema.index({ 'loyalty.tier': 1 });
customerSchema.index({ status: 1 });
customerSchema.index({ createdAt: -1 });
customerSchema.index({ tags: 1 });

// Update loyalty tier based on total spent
customerSchema.pre('save', function(next) {
  if (this.loyalty.totalSpent >= 500) {
    this.loyalty.tier = 'Platinum';
  } else if (this.loyalty.totalSpent >= 250) {
    this.loyalty.tier = 'Gold';
  } else if (this.loyalty.totalSpent >= 100) {
    this.loyalty.tier = 'Silver';
  } else {
    this.loyalty.tier = 'Bronze';
  }
  next();
});

module.exports = mongoose.model('Customer', customerSchema); 