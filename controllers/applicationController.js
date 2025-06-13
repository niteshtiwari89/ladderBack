const Application = require('../models/Application');

exports.createApplication = async (req, res) => {
  try {
    const { fullName, email, phone, position, yearsOfExperience, coverLetter } = req.body;
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;

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