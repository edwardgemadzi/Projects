const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  cost: {
    type: Number,
    default: 0,
    min: [0, 'Cost cannot be negative']
  },
  profit: {
    type: Number,
    default: 0
  },
  profitMargin: {
    type: Number,
    default: 0
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop'
  },
  category: {
    type: String,
    enum: ['bread', 'cakes', 'pastries', 'cookies', 'specialty'],
    required: [true, 'Product category is required']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 5,
    min: [0, 'Low stock threshold cannot be negative']
  },
  inStock: {
    type: Boolean,
    default: true
  },
  supplier: {
    name: String,
    contact: String,
    email: String,
    phone: String,
    leadTime: Number // days
  },
  ingredients: [{
    name: String,
    quantity: Number,
    unit: String,
    cost: Number
  }],
  allergens: [{
    type: String,
    enum: ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Wheat', 'Fish', 'Shellfish']
  }],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  preparationTime: {
    type: Number, // minutes
    default: 0
  },
  shelfLife: {
    type: Number, // days
    default: 7
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSeasonal: {
    type: Boolean,
    default: false
  },
  seasonStart: Date,
  seasonEnd: Date,
  tags: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Calculate profit and margin before saving
productSchema.pre('save', function(next) {
  this.profit = this.price - this.cost;
  this.profitMargin = this.price > 0 ? (this.profit / this.price) * 100 : 0;
  next();
});

// Index for analytics queries
productSchema.index({ category: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
