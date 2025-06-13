const cloudinary = require('cloudinary').v2;
const Application = require('../models/Application'); // adjust path as needed

// Configure Cloudinary (if not already configured globally)
cloudinary.config({
  cloud_name: 'dqz8qskua',
  api_key: '751916864475481',
  api_secret: 'qiY8HEEGJ7MEKM0DMk44dW1gIaA'
});

exports.createApplication = async (req, res) => {
  try {
    const { fullName, email, phone, position, yearsOfExperience, coverLetter } = req.body;
    let resumeUrl = null;

    if (req.file) {
      // Upload resume to Cloudinary (as raw file)
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'resumes', resource_type: 'raw' },
        (error, result) => {
          if (error) throw error;
          resumeUrl = result.secure_url;
        }
      );
      await new Promise((resolve, reject) => {
        req.file.stream.pipe(result).on('finish', resolve).on('error', reject);
      });
    }

    if (!resumeUrl) {
      return res.status(400).json({ message: 'Resume file is required.' });
    }

    const application = new Application({
      fullName,
      email,
      phone,
      position,
      yearsOfExperience,
      resumeUrl,
      coverLetter
    });

    await application.save();
    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find().sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add this to your route handler for application submission
exports.submitApplication = async (req, res) => {
  try {
    const { name, email, ...otherFields } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Resume is required' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'resumes',
      resource_type: 'raw', // Important for non-image files
    });

    const application = new Application({
      name,
      email,
      ...otherFields,
      resumeUrl: uploadResponse.secure_url,
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(400).json({ message: error.message });
  }
};