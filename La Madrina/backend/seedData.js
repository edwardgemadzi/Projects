const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

// Default admin user
const defaultAdmin = {
  name: 'La Madrina Admin',
  email: 'admin@lamadrinabakery.com',
  password: 'AdminPass123!',
  role: 'admin',
  isEmailVerified: true,
  isActive: true
};

// Sample users
const sampleUsers = [
  {
    name: 'Maria Gonzalez',
    email: 'maria@lamadrinabakery.com',
    password: 'BakerPass123!',
    role: 'baker',
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Carlos Rodriguez',
    email: 'carlos@lamadrinabakery.com',
    password: 'ManagerPass123!',
    role: 'manager',
    isEmailVerified: true,
    isActive: true
  },
  {
    name: 'Ana Martinez',
    email: 'ana@example.com',
    password: 'CustomerPass123!',
    role: 'customer',
    isEmailVerified: true,
    isActive: true,
    phone: '+1-555-0123',
    address: {
      street: '123 Main Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    }
  }
];

// Sample products data
const sampleProducts = [
  {
    name: "Artisan Sourdough Bread",
    description: "Traditional sourdough with a crispy crust and soft, tangy interior. Made with our 20-year-old starter.",
    price: 6.50,
    category: "bread",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Chocolate Croissant",
    description: "Buttery, flaky pastry filled with rich dark chocolate. Perfect with your morning coffee.",
    price: 3.25,
    category: "pastries",
    image: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Birthday Celebration Cake",
    description: "Three-layer vanilla cake with buttercream frosting. Can be customized for any celebration.",
    price: 35.00,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Chocolate Chip Cookies",
    description: "Classic homemade cookies with premium chocolate chips. Sold by the dozen.",
    price: 12.00,
    category: "cookies",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "French Baguette",
    description: "Authentic French baguette with a golden crust and airy interior. Baked fresh daily.",
    price: 4.75,
    category: "bread",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Almond Croissant",
    description: "Buttery croissant filled with sweet almond cream and topped with sliced almonds.",
    price: 3.75,
    category: "pastries",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Red Velvet Cupcakes",
    description: "Moist red velvet cupcakes topped with cream cheese frosting. Sold in packs of 6.",
    price: 18.00,
    category: "cakes",
    image: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Oatmeal Raisin Cookies",
    description: "Chewy oatmeal cookies with plump raisins and a hint of cinnamon. Sold by the dozen.",
    price: 11.00,
    category: "cookies",
    image: "https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Whole Wheat Bread",
    description: "Nutritious whole wheat bread made with organic flour and seeds.",
    price: 5.50,
    category: "bread",
    image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Apple Turnovers",
    description: "Flaky pastry filled with cinnamon-spiced apples and lightly glazed.",
    price: 4.50,
    category: "pastries",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Wedding Cake",
    description: "Multi-tier custom wedding cake. Flavors and design customizable. Please order 2 weeks in advance.",
    price: 150.00,
    category: "specialty",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=300&h=250&fit=crop&crop=center",
    inStock: true
  },
  {
    name: "Sugar Cookies",
    description: "Classic sugar cookies with royal icing. Perfect for decorating or enjoying as-is. Sold by the dozen.",
    price: 10.00,
    category: "cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=250&fit=crop&crop=center",
    inStock: true
  }
];

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user first
    const admin = await User.create(defaultAdmin);
    console.log(`✅ Created admin user: ${admin.email}`);
    console.log(`   Password: ${defaultAdmin.password}`);

    // Create sample users
    const users = await User.create(sampleUsers);
    console.log(`✅ Created ${users.length} sample users`);

    // Create products with admin as creator
    const productsWithCreator = sampleProducts.map(product => ({
      ...product,
      createdBy: admin._id
    }));

    const products = await Product.insertMany(productsWithCreator);
    console.log(`✅ Added ${products.length} sample products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n👤 Users created:');
    console.log(`   Admin: ${defaultAdmin.email} (password: ${defaultAdmin.password})`);
    sampleUsers.forEach(user => {
      console.log(`   ${user.role}: ${user.email} (password: ${user.password})`);
    });

    console.log('\n🛍️  Sample products:');
    products.forEach(product => {
      console.log(`   - ${product.name} ($${product.price}) - ${product.category}`);
    });

    console.log('\n⚠️  IMPORTANT: Change the admin password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeder
seedData();
