const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    technologies: { type: String, required: true },
    figmaProvider: { type: String, required: true },
    whatWasBuild: { type: String, required: true },
    whatWeAdded: { type: String, required: true },
    problemBefore: { type: String, required: true },
    problemSolved: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Case', caseSchema);
