# 🚀 JRP - Job Recruitment Platform

A modern, full-stack job recruitment platform built with React, Node.js, and MongoDB. Connect job seekers with employers through an intuitive and feature-rich application.

## ✨ Features

### 🔐 Authentication & Security
- **Multi-role authentication** (Admin, Employer, Job Seeker)
- **JWT-based sessions** with secure httpOnly cookies
- **Role-based access control** (RBAC)
- **Password hashing** with bcrypt
- **Rate limiting** and security middleware

### 💼 Job Management
- **Advanced job search** with real-time filtering
- **Job posting** and management for employers
- **Application tracking** with status updates
- **File upload** with Cloudinary integration
- **Responsive job cards** with company logos

### 👥 User Roles

#### **Admin**
- Complete system overview dashboard
- User management and analytics
- Job monitoring and moderation
- System statistics and insights

#### **Employer**
- Job posting and management
- Application review and status updates
- Company dashboard with analytics
- Profile and company management

#### **Job Seeker**
- Advanced job search and filtering
- Application submission and tracking
- Profile management and resume upload
- Job alerts and notifications

### 🎨 User Experience
- **Responsive design** with Bootstrap 5
- **Real-time search** and filtering
- **Loading states** and error handling
- **Professional UI** with Font Awesome icons
- **Notification system** for user feedback

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Bootstrap 5** for styling
- **Axios** for API communication
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Multer** for file uploads
- **Cloudinary** for cloud storage

### Security & Performance
- **Helmet** for security headers
- **CORS** configuration
- **Rate limiting** with express-rate-limit
- **Compression** middleware
- **Winston** logging

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd jrp
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Environment Setup**
```bash
# Backend (.env file in backend directory)
NODE_ENV=development
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
COOKIE_SECURE=false
```

5. **Start the development servers**

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd backend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 📊 Database Schema

### Users
- Name, email, password (hashed)
- Role: admin, employer, jobseeker
- Timestamps for audit trail

### Jobs
- Title, company, location, industry
- Description, skills, logo
- Created by (employer reference)
- Timestamps

### Applications
- Job and applicant references
- Resume and cover letter
- Status: applied, under_review, accepted, rejected
- Timestamps

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (employer only)
- `GET /api/jobs/:id` - Get specific job
- `PUT /api/jobs/:id` - Update job (owner only)
- `DELETE /api/jobs/:id` - Delete job (owner only)

### Applications
- `POST /api/applications` - Submit application
- `GET /api/applications` - Get user applications
- `GET /api/applications/check/:jobId` - Check application status
- `PUT /api/applications/:id` - Update application status

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/jobs` - Get all jobs with details

### File Upload
- `POST /api/upload` - Upload files to Cloudinary

## 🧪 Testing

### Test Accounts

#### Admin
- Email: `admin@jrp.com`
- Password: `Admin123`

#### Employers
- Email: `sarah@techcorp.com`
- Password: `Employer123`
- Email: `michael@startupinc.com`
- Password: `Employer123`

#### Job Seekers
- Email: `alex@example.com`
- Password: `Jobseeker123`
- Email: `emma@example.com`
- Password: `Jobseeker123`

## 🚀 Deployment

### Frontend (Vercel)
```bash
npm run build
```

### Backend (Vercel/Railway/Heroku)
```bash
npm start
```

## 📈 Performance

- **Code splitting** with React.lazy()
- **Image optimization** with Cloudinary
- **Database indexing** for fast queries
- **Compression** middleware for responses
- **Caching** strategies for static assets

## 🔒 Security Features

- **JWT authentication** with secure cookies
- **Password hashing** with bcrypt
- **Input validation** with express-validator
- **Rate limiting** to prevent abuse
- **CORS** configuration for cross-origin requests
- **Helmet** for security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using modern web technologies**
