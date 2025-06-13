const cloudinary = require('cloudinary').v2;
const Project = require('../models/Project'); // adjust path as needed

// Configure Cloudinary (if not already configured globally)
cloudinary.config({
  cloud_name: 'dqz8qskua',
  api_key: '751916864475481',
  api_secret: 'qiY8HEEGJ7MEKM0DMk44dW1gIaA'
});

exports.createProject = async (req, res) => {
  try {
    const { title, snippet, description, ...otherFields } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: 'projects',
    });

    const project = new Project({
      title,
      snippet,
      description,
      ...otherFields,
      image: uploadResponse.secure_url,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const update = {
      title: req.body.title,
      snippet: req.body.snippet,
      description: req.body.description,
    };
    if (req.file) {
      // Upload new image to Cloudinary using buffer
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'projects' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
      update.imageUrl = result.secure_url;
    }
    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};