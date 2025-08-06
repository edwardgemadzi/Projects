const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
require('./config/env');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - comment out to keep existing data)
    // await User.deleteMany({});
    // await Job.deleteMany({});
    // await Application.deleteMany({});
    // console.log('🗑️  Cleared existing data');

    // Hash password function
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    };

    // Create Users
    const users = [
      // Admin
      {
        name: 'System Administrator',
        email: 'admin@jrp.com',
        password: await hashPassword('Admin123'),
        role: 'admin'
      },
      
      // Employers
      {
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        password: await hashPassword('Employer123'),
        role: 'employer'
      },
      {
        name: 'Michael Chen',
        email: 'michael@startupinc.com',
        password: await hashPassword('Employer123'),
        role: 'employer'
      },
      {
        name: 'Lisa Garcia',
        email: 'lisa@designstudio.com',
        password: await hashPassword('Employer123'),
        role: 'employer'
      },
      
      // Job Seekers
      {
        name: 'Alex Thompson',
        email: 'alex@example.com',
        password: await hashPassword('Jobseeker123'),
        role: 'jobseeker'
      },
      {
        name: 'Emma Rodriguez',
        email: 'emma@example.com',
        password: await hashPassword('Jobseeker123'),
        role: 'jobseeker'
      },
      {
        name: 'David Kim',
        email: 'david@example.com',
        password: await hashPassword('Jobseeker123'),
        role: 'jobseeker'
      },
      {
        name: 'Sophie Williams',
        email: 'sophie@example.com',
        password: await hashPassword('Jobseeker123'),
        role: 'jobseeker'
      }
    ];

    // Insert users (check if they already exist first)
    const createdUsers = {};
    for (const userData of users) {
      let user = await User.findOne({ email: userData.email });
      if (!user) {
        user = await User.create(userData);
        console.log(`👤 Created user: ${userData.email} (${userData.role})`);
      } else {
        console.log(`🔄 User already exists: ${userData.email}`);
      }
      createdUsers[userData.email] = user;
    }

    // Get existing employers for job creation
    const employers = await User.find({ role: 'employer' });
    
    // Create Jobs
    const jobs = [
      {
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Solutions',
        location: 'San Francisco, CA',
        industry: 'Technology',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: 120000,
        description: `We are looking for a Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.

Key Responsibilities:
• Develop scalable web applications using React and Node.js
• Design and implement RESTful APIs
• Collaborate with cross-functional teams
• Mentor junior developers
• Participate in code reviews and architectural decisions

Requirements:
• 5+ years of experience in web development
• Strong proficiency in JavaScript, React, and Node.js
• Experience with databases (MongoDB, PostgreSQL)
• Knowledge of cloud platforms (AWS, Azure)
• Excellent problem-solving skills`,
        requirements: `• Bachelor's degree in Computer Science or related field
• 5+ years of professional web development experience
• Proficiency in React, Node.js, JavaScript/TypeScript
• Experience with SQL and NoSQL databases
• Familiarity with cloud deployment and DevOps practices
• Strong communication and teamwork skills`,
        createdBy: employers[0] ? employers[0]._id : null
      },
      {
        title: 'UX/UI Designer',
        company: 'Design Studio Pro',
        location: 'New York, NY',
        industry: 'Design',
        jobType: 'Full-time',
        experienceLevel: 'Mid-level',
        salary: 75000,
        description: `Join our creative team as a UX/UI Designer and help create amazing user experiences for our clients' digital products.

What you'll do:
• Create wireframes, prototypes, and high-fidelity designs
• Conduct user research and usability testing
• Collaborate with developers and product managers
• Maintain design systems and style guides
• Present design concepts to clients and stakeholders`,
        requirements: `• 3+ years of UX/UI design experience
• Proficiency in Figma, Sketch, or Adobe Creative Suite
• Strong portfolio demonstrating design process
• Understanding of responsive design principles
• Experience with user research methodologies
• Knowledge of HTML/CSS is a plus`,
        createdBy: employers[1] ? employers[1]._id : null
      },
      {
        title: 'Marketing Manager',
        company: 'Growth Marketing Inc',
        location: 'Remote',
        industry: 'Marketing',
        jobType: 'Full-time',
        experienceLevel: 'Mid-level',
        salary: 85000,
        description: `We're seeking a strategic Marketing Manager to lead our digital marketing efforts and drive growth across multiple channels.

Responsibilities:
• Develop and execute comprehensive marketing strategies
• Manage social media presence and content marketing
• Analyze campaign performance and optimize ROI
• Lead a team of marketing specialists
• Collaborate with sales team to align marketing efforts`,
        requirements: `• 4+ years of marketing experience
• Strong analytical and project management skills
• Experience with marketing automation tools
• Proficiency in Google Analytics and advertising platforms
• Excellent written and verbal communication skills
• Bachelor's degree in Marketing or related field`,
        createdBy: employers[2] ? employers[2]._id : null
      },
      {
        title: 'Data Scientist',
        company: 'TechCorp Solutions',
        location: 'Austin, TX',
        industry: 'Technology',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salary: 130000,
        description: `Join our data science team to build machine learning models and extract insights from large datasets to drive business decisions.

Key Activities:
• Develop predictive models and algorithms
• Analyze complex datasets to identify trends and patterns
• Create data visualizations and reports for stakeholders
• Collaborate with engineering teams to deploy models
• Stay current with latest ML/AI technologies`,
        requirements: `• Master's degree in Data Science, Statistics, or related field
• 4+ years of experience in data science or machine learning
• Proficiency in Python/R and SQL
• Experience with ML frameworks (TensorFlow, PyTorch, scikit-learn)
• Strong statistical analysis and modeling skills
• Knowledge of cloud platforms and big data technologies`,
        createdBy: employers[0] ? employers[0]._id : null
      },
      {
        title: 'Junior Frontend Developer',
        company: 'Startup Inc',
        location: 'Los Angeles, CA',
        industry: 'Technology',
        jobType: 'Full-time',
        experienceLevel: 'Entry-level',
        salary: 65000,
        description: `Great opportunity for a junior developer to join our fast-growing startup and work on exciting projects with modern technologies.

What you'll learn:
• Frontend development with React and Vue.js
• Working in an agile development environment
• Code review processes and best practices
• Modern development tools and workflows
• Direct mentorship from senior developers`,
        requirements: `• 1-2 years of frontend development experience
• Knowledge of HTML, CSS, and JavaScript
• Familiarity with React or Vue.js
• Understanding of responsive design
• Git version control experience
• Eager to learn and grow in a fast-paced environment`,
        createdBy: employers[1] ? employers[1]._id : null
      },
      {
        title: 'DevOps Engineer',
        company: 'Cloud Solutions Ltd',
        location: 'Seattle, WA',
        industry: 'Technology',
        jobType: 'Full-time',
        experienceLevel: 'Mid-level',
        salary: 110000,
        description: `We're looking for a DevOps Engineer to help scale our infrastructure and improve our deployment processes.

Your mission:
• Design and maintain CI/CD pipelines
• Manage cloud infrastructure on AWS/Azure
• Implement monitoring and logging solutions
• Automate deployment and scaling processes
• Ensure security best practices`,
        requirements: `• 3+ years of DevOps or infrastructure experience
• Experience with containerization (Docker, Kubernetes)
• Proficiency in infrastructure as code (Terraform, CloudFormation)
• Knowledge of CI/CD tools (Jenkins, GitLab CI, GitHub Actions)
• Scripting skills in Python or Bash
• Understanding of networking and security principles`,
        createdBy: employers[2] ? employers[2]._id : null
      }
    ];

    // Insert jobs (check if they already exist)
    const createdJobs = [];
    for (const jobData of jobs) {
      let job = await Job.findOne({ title: jobData.title, company: jobData.company });
      if (!job && jobData.createdBy) {
        job = await Job.create(jobData);
        console.log(`💼 Created job: ${jobData.title} at ${jobData.company}`);
      } else if (job) {
        console.log(`🔄 Job already exists: ${jobData.title} at ${jobData.company}`);
      }
      if (job) createdJobs.push(job);
    }

    // Create some sample applications
    const jobSeekers = await User.find({ role: 'jobseeker' });
    const availableJobs = await Job.find({});

    if (jobSeekers.length > 0 && availableJobs.length > 0) {
      const sampleApplications = [
        {
          job: availableJobs[0]._id,
          applicant: jobSeekers[0]._id,
          status: 'submitted',
          resume: 'https://example.com/resume/alex_thompson.pdf',
          coverLetter: 'I am very interested in this position and believe my skills in full-stack development make me a great fit for your team.'
        },
        {
          job: availableJobs[1]._id,
          applicant: jobSeekers[1]._id,
          status: 'reviewing',
          resume: 'https://example.com/resume/emma_rodriguez.pdf',
          coverLetter: 'As a passionate UX/UI designer, I would love to contribute to your creative projects and help create amazing user experiences.'
        },
        {
          job: availableJobs[0]._id,
          applicant: jobSeekers[2]._id,
          status: 'accepted',
          resume: 'https://example.com/resume/david_kim.pdf',
          coverLetter: 'My experience in React and Node.js development aligns perfectly with your requirements.'
        }
      ];

      for (const appData of sampleApplications) {
        const existingApp = await Application.findOne({
          job: appData.job,
          applicant: appData.applicant
        });
        
        if (!existingApp) {
          await Application.create(appData);
          console.log(`📝 Created application for job ID: ${appData.job}`);
        }
      }
    }

    console.log('\n🎉 Database seeding completed successfully!');
    
    // Display login credentials
    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('\n👑 ADMIN ACCOUNT:');
    console.log('Email: admin@jrp.com');
    console.log('Password: Admin123');
    
    console.log('\n💼 EMPLOYER ACCOUNTS:');
    console.log('Email: sarah@techcorp.com | Password: Employer123');
    console.log('Email: michael@startupinc.com | Password: Employer123');
    console.log('Email: lisa@designstudio.com | Password: Employer123');
    
    console.log('\n🔍 JOB SEEKER ACCOUNTS:');
    console.log('Email: alex@example.com | Password: Jobseeker123');
    console.log('Email: emma@example.com | Password: Jobseeker123');
    console.log('Email: david@example.com | Password: Jobseeker123');
    console.log('Email: sophie@example.com | Password: Jobseeker123');
    
    console.log('\n🏢 EXISTING ACCOUNTS (if any):');
    const existingUsers = await User.find({ 
      email: { $nin: users.map(u => u.email) } 
    });
    existingUsers.forEach(user => {
      console.log(`Email: ${user.email} | Role: ${user.role}`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
