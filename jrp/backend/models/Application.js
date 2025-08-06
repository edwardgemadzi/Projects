const mongoose = require('mongoose')

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job',
            required: true
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        resume: {
            type: String,
            required: true
        },
        coverLetter: {
            type: String
        },
        status: {
            type: String,
            enum: ['applied', 'under_review', 'accepted', 'rejected'],
            default: 'applied'
        }
    },
    { timestamps: true}
);

// Create a compound unique index to prevent duplicate applications
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);