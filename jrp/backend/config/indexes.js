const mongoose = require('mongoose');
const logger = require('./logger');

const createDatabaseIndexes = async () => {
    try {
        // User model indexes
        await mongoose.connection.db.collection('users').createIndexes([
            { key: { email: 1 }, unique: true },
            { key: { role: 1 } },
            { key: { createdAt: -1 } }
        ]);

        // Job model indexes
        await mongoose.connection.db.collection('jobs').createIndexes([
            { key: { title: 'text', company: 'text', location: 'text', description: 'text' } },
            { key: { location: 1 } },
            { key: { industry: 1 } },
            { key: { createdBy: 1 } },
            { key: { createdAt: -1 } },
            { key: { skills: 1 } }
        ]);

        // Application model indexes - now that duplicates are cleaned up
        await mongoose.connection.db.collection('applications').createIndexes([
            { key: { job: 1, applicant: 1 }, unique: true }, // Prevent duplicate applications
            { key: { applicant: 1 } },
            { key: { job: 1 } },
            { key: { createdAt: -1 } }
        ]);

        logger.info('Database indexes created successfully');
    } catch (error) {
        logger.error('Error creating database indexes:', error);
    }
};

module.exports = createDatabaseIndexes;
