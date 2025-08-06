# 🚀 Vercel Deployment Guide for JRP

## Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas**: Set up a cloud MongoDB database
3. **Cloudinary Account**: For file uploads
4. **Vercel Account**: Sign up at vercel.com

## Step-by-Step Deployment

### 1. Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster (free tier is fine for testing)
3. Create a database user with read/write access
4. Whitelist all IP addresses (0.0.0.0/0) for Vercel
5. Get your connection string (it should look like):
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   ```

### 2. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up and get your:
   - Cloud Name
   - API Key
   - API Secret

### 3. Vercel Deployment

1. **Connect GitHub**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   In Vercel Dashboard → Settings → Environment Variables, add:

   ```
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   JWT_SECRET=your-super-secure-32-char-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   NODE_ENV=production
   CLIENT_URL=https://your-app-name.vercel.app
   ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### 4. Post-Deployment Setup

1. **Update CLIENT_URL**: After deployment, update the `CLIENT_URL` environment variable with your actual Vercel URL

2. **Test the Application**:
   - Visit your Vercel URL
   - Test registration, login, job posting, and applications
   - Check the API endpoints work correctly

## Important Notes

### Database Indexes
- Indexes are automatically created on first connection
- This may take a few seconds on cold starts

### File Uploads
- All files are stored in Cloudinary
- Make sure your Cloudinary account has sufficient storage

### Rate Limiting
- Rate limiting is configured for production
- API endpoints are limited to prevent abuse

### Security Features Enabled
- Helmet security headers
- CORS configured for your domain
- JWT tokens with secure cookies
- Input validation on all endpoints

## Monitoring and Logs

### Vercel Functions
- Go to Vercel Dashboard → Functions
- View real-time logs and performance metrics

### Error Monitoring
- Check Vercel function logs for any errors
- Monitor database connection issues

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `CLIENT_URL` environment variable

## Troubleshooting

### Common Issues

1. **MongoDB Connection Timeout**:
   - Ensure IP whitelist includes 0.0.0.0/0
   - Check connection string format

2. **CORS Errors**:
   - Verify `CLIENT_URL` matches your Vercel domain
   - Check if API routes are accessible

3. **File Upload Issues**:
   - Verify Cloudinary credentials
   - Check file size limits (5MB default)

4. **Authentication Not Working**:
   - Ensure `JWT_SECRET` is set and secure
   - Check if cookies are being set properly

### Debug Mode
- Enable debug logs by checking Vercel function logs
- Use browser dev tools to inspect network requests

## Performance Optimization

### Cold Starts
- First request after inactivity may be slower
- Database connection is cached to minimize cold start impact

### Caching
- Static assets are automatically cached by Vercel
- Consider implementing Redis for API response caching

## Security Considerations

### Environment Variables
- Never commit `.env` files to Git
- Use Vercel dashboard for production variables
- Rotate secrets regularly

### Database Security
- Use MongoDB Atlas security features
- Enable database auditing if needed
- Regular backups are handled by Atlas

## Scaling

### Database
- MongoDB Atlas auto-scales
- Consider upgrading cluster tier for higher traffic

### Vercel
- Automatically scales based on traffic
- Upgrade plan for higher limits if needed

## Support

If you encounter issues:
1. Check Vercel function logs
2. Review MongoDB Atlas logs
3. Verify all environment variables are set correctly
4. Test API endpoints directly using tools like Postman
