# La Madrina Bakery - Frontend

A modern, responsive React frontend for La Madrina Bakery built with React, React Router, and Bootstrap 5.

## Features

- **Responsive Design**: Mobile-first design using Bootstrap 5
- **React Router**: Smooth navigation between pages
- **API Integration**: Connects to the backend REST API
- **Modern UI**: Clean, professional design with bakery-themed styling
- **Interactive Components**: Product cards, contact forms, and navigation

## Pages

- **Home**: Welcome page with hero section and featured products carousel
- **Menu**: Product catalog with filtering by category
- **About**: Bakery story, mission, values, and team
- **Contact**: Contact form with validation and bakery information
- **Order**: Order page with current ordering options (online ordering coming soon)

## Components

- **Navbar**: Responsive navigation with active link highlighting
- **Footer**: Contact information, hours, and social media links
- **ProductCard**: Reusable component for displaying bakery items

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your API base URL.

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

For production, update this to your deployed backend URL.

## Building for Production

```bash
npm run build
```

This creates a `dist` folder with the production build ready for deployment.

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set the environment variable `VITE_API_BASE_URL` to your production API URL
3. Deploy!

### Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

## API Integration

The frontend communicates with the backend through the API service located in `src/services/api.js`. This handles:

- Product fetching and display
- Contact form submissions
- Order management (when implemented)
- Error handling and loading states

## Styling

- **Bootstrap 5**: For responsive grid system and components
- **Custom CSS**: Bakery-themed color scheme and styling in `App.css`
- **CSS Variables**: Consistent color palette throughout the app

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Features

- Lazy loading ready
- Optimized images with placeholder fallbacks
- Minimal bundle size with Vite
- Bootstrap components loaded only when needed

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
npm run lint   # Run ESLint
```

## Customization

The app uses CSS variables for easy theme customization. Update the variables in `App.css`:

```css
:root {
  --primary-color: #8B4513;
  --secondary-color: #D2691E;
  --accent-color: #F4A460;
  --text-dark: #2C1810;
  --text-light: #F5F5DC;
  --bg-cream: #FFF8DC;
}
```
