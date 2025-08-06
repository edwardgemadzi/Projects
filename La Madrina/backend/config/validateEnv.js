// Environment variable validation
const validateEnvironment = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGO_URI',
    'JWT_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    process.exit(1);
  }

  // Validate JWT secret strength
  if (process.env.JWT_SECRET.length < 32) {
    console.error('❌ JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }

  // Warn about default values in production
  if (process.env.NODE_ENV === 'production') {
    const defaultValues = {
      JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
      MONGO_URI: 'mongodb://localhost:27017/la-madrina-bakery'
    };

    Object.entries(defaultValues).forEach(([key, defaultValue]) => {
      if (process.env[key] === defaultValue) {
        console.error(`❌ Production environment detected but ${key} is using default value!`);
        process.exit(1);
      }
    });
  }

  console.log('✅ Environment variables validated successfully');
};

module.exports = validateEnvironment;
