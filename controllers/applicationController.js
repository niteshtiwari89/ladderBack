const Application = require('../models/Application');
const cloudinary = require('../utils/cloudinary');

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