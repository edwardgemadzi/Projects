# La Madrina Bakery - Full Stack Application

A complete full-stack bakery website featuring a React frontend and Node.js/Express/MongoDB backend with enterprise-level security and authentication.

## 🏗️ Project Structure

```
La Madrina/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── assets/        # Images and static files
│   ├── public/
│   └── package.json
├── backend/           # Node.js API
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── config/           # Database configuration
│   ├── middleware/       # Custom middleware
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB URI and JWT secret:
```
PORT=5002
MONGO_URI=mongodb://localhost:27017/la_madrina_bakery
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_secret_key_here_make_it_very_long_and_random
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
```

5. Seed the database with sample data and users:
```bash
npm run seed
```

6. Start the development server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5002`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```
VITE_API_BASE_URL=http://localhost:5002/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

## 🎯 Features

### Frontend (React + Bootstrap 5)
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **React Router**: Smooth navigation between pages
- **Product Catalog**: Browse bakery items with filtering
- **Contact Form**: Submit inquiries with validation
- **Modern UI**: Clean, professional bakery-themed design

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete CRUD operations for products
- **Authentication**: JWT-based auth with role-based access control
- **Security**: Comprehensive security middleware and validation
- **User Management**: Multi-role system (admin, manager, baker, customer)
- **Data Validation**: Mongoose schemas with validation
- **Error Handling**: Comprehensive error management
- **Database**: MongoDB with Mongoose ODM

## 📱 Pages

1. **Home**: Hero section, featured products carousel
2. **Menu**: Product catalog with category filtering
3. **About**: Bakery story, mission, team information
4. **Contact**: Contact form and bakery details
5. **Order**: Order placement (coming soon functionality)

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user profile
- `PUT /api/auth/updatepassword` - Change password
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:token` - Reset password
- `GET /api/auth/verify/:token` - Verify email

### Products
- `GET /api/products` - Get all products (Public)
- `GET /api/products/:id` - Get single product (Public)
- `POST /api/products` - Create new product (Baker+)
- `PUT /api/products/:id` - Update product (Baker+)
- `DELETE /api/products/:id` - Delete product (Manager+)

### Contact
- `POST /api/contact` - Submit contact form (Public)
- `GET /api/contact` - Get all messages (Manager+)

### Orders
- `POST /api/orders` - Create new order (Public/Authenticated)
- `GET /api/orders` - Get all orders (Baker+)
- `GET /api/orders/:id` - Get single order (Baker+)

### Admin/User Management
- `GET /api/admin/users` - Get all users (Admin)
- `GET /api/admin/users/:id` - Get single user (Admin)
- `POST /api/admin/users` - Create user (Admin)
- `PUT /api/admin/users/:id` - Update user (Admin)
- `DELETE /api/admin/users/:id` - Delete user (Admin)
- `GET /api/admin/users/stats` - Get user statistics (Admin)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set environment variable: `VITE_API_BASE_URL=https://your-backend-url.com/api`
3. Deploy automatically

### Backend (Render/Railway)

#### Render
1. Connect GitHub repository
2. Set environment variables in Render dashboard
3. Deploy

#### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy

## 🗄️ Database Models

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (customer, baker, manager, admin),
  isActive: Boolean (default: true),
  isEmailVerified: Boolean (default: false),
  phone: String,
  address: Object,
  preferences: Object,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date
}
```

### Product
```javascript
{
  name: String (required),
  description: String,
  price: Number (required),
  image: String,
  category: String (bread, cakes, pastries, cookies, specialty),
  inStock: Boolean (default: true),
  createdBy: ObjectId (User),
  updatedBy: ObjectId (User)
}
```

### Contact
```javascript
{
  name: String (required),
  email: String (required),
  message: String (required),
  createdAt: Date
}
```

### Order
```javascript
{
  customerName: String (required),
  email: String (required),
  items: [{ productId: ObjectId, quantity: Number }],
  total: Number (required),
  status: String (Pending, Confirmed, etc.),
  createdAt: Date
}
```

## 🔒 Security Features

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Customer, Baker, Manager, Admin roles
- **Account Lockout**: Protection against brute force attacks
- **Password Requirements**: Strong password validation
- **Email Verification**: Account verification system
- **Password Reset**: Secure password recovery

### Security Middleware
- **Rate Limiting**: Different limits for various endpoints
- **Brute Force Protection**: Login attempt monitoring
- **Input Validation**: Comprehensive data validation
- **XSS Protection**: Cross-site scripting prevention
- **NoSQL Injection**: Database injection prevention
- **CORS Protection**: Cross-origin request security
- **Security Headers**: Helmet.js security headers
- **Parameter Pollution**: HPP protection

### User Roles & Permissions

| Role | Permissions |
|------|-------------|
| **Customer** | View products, place orders, manage profile |
| **Baker** | Customer permissions + manage products |
| **Manager** | Baker permissions + view orders, contacts |
| **Admin** | Full access + user management |

## 🎨 Customization

### Colors
The app uses CSS variables for easy theming:
```css
:root {
  --primary-color: #E91E63;    /* Pink */
  --secondary-color: #F8BBD9;  /* Light Pink */
  --accent-color: #FCE4EC;     /* Very Light Pink */
  --text-dark: #000000;        /* Black */
  --text-light: #FFFFFF;       /* White */
  --bg-cream: #FFFFFF;         /* White background */
  --pink-gradient: linear-gradient(135deg, #E91E63 0%, #F8BBD9 100%);
}
```

### Adding Products
Use the API endpoints or add sample data through the database directly.

## �️ Troubleshooting

### Common Issues

#### Frontend Can't Connect to Backend
- **Issue**: "Failed to load resource: A server with the specified hostname could not be found"
- **Solution**: Ensure both servers are running:
  ```bash
  # Terminal 1 - Backend
  cd backend && npm run dev
  
  # Terminal 2 - Frontend  
  cd frontend && npm run dev
  ```
- **Check**: Backend should be on `http://localhost:5002`, Frontend on `http://localhost:5173`

#### Image Loading Issues
- **Issue**: Product images not loading
- **Solution**: Images now use Unsplash CDN for reliability
- **Fallback**: Automatic fallback to SVG placeholder if external images fail

#### Database Connection Issues
- **Issue**: MongoDB connection failed
- **Solution**: Ensure MongoDB is running:
  ```bash
  # macOS (if installed via Homebrew)
  brew services start mongodb-community@7.0
  
  # Check status
  brew services list | grep mongodb
  ```

#### React Router Warnings
- **Issue**: React Router v6 future flag warnings in console
- **Solution**: Future flags enabled for v7 compatibility in App.jsx
- **Details**: `v7_startTransition` and `v7_relativeSplatPath` flags configured

#### Port 5000 Already in Use (macOS)
- **Issue**: AirPlay Receiver uses port 5000 on macOS
- **Solution**: Backend configured to use port 5002 instead

## �📝 Scripts

### Backend
```bash
npm start      # Production server
npm run dev    # Development with nodemon
```

### Frontend
```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email info@lamadrinabakery.com or create an issue in the repository.

---

**Built with ❤️ for La Madrina Bakery**
