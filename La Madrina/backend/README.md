# La Madrina Bakery - Backend API

A RESTful API for La Madrina Bakery built with Node.js, Express, and MongoDB.

## Features

- Product management (CRUD operations)
- Contact form handling
- Order management
- Data validation with Mongoose
- Security middleware (Helmet, CORS, Rate Limiting)
- Error handling
- Environment configuration

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (Admin)
- `GET /api/orders/:id` - Get single order (Admin)

### Health Check
- `GET /api/health` - API health status

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your MongoDB URI and other settings.

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/la_madrina_bakery
NODE_ENV=development
```

## Database Models

### Product
- name (String, required)
- description (String)
- price (Number, required)
- image (String)
- category (String: bread, cakes, pastries, cookies, specialty)
- inStock (Boolean, default: true)

### Contact
- name (String, required)
- email (String, required)
- message (String, required)
- createdAt (Date)

### Order
- customerName (String, required)
- email (String, required)
- items (Array of objects with productId and quantity)
- total (Number, required)
- status (String: Pending, Confirmed, In Progress, Ready, Completed, Cancelled)
- createdAt (Date)

## Deployment

This API is ready for deployment on platforms like Render, Railway, or Heroku.

### Render Deployment
1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy!

### Railway Deployment
1. Connect your GitHub repository
2. Add environment variables
3. Deploy!

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Security Features

- Helmet for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation
- Error handling middleware
