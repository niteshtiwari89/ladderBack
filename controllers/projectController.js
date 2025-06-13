const Project = require('../models/Project');
const cloudinary = require('../utils/cloudinary');

exports.createProject = async (req, res) => {
  try {
    const { title, snippet, description } = req.body;
    let imageUrl = null;

    if (req.file) {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'projects' },
        (error, result) => {
          if (error) throw error;
          imageUrl = result.secure_url;
        }
      );
      await new Promise((resolve, reject) => {
        req.file.stream.pipe(result).on('finish', resolve).on('error', reject);
      });
    }

    if (!imageUrl) return res.status(400).json({ message: 'Image is required.' });

    const project = new Project({ title, snippet, description, imageUrl });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'projects' },
        (error, result) => {
          if (error) throw error;
          update.imageUrl = result.secure_url;
        }
      );
      await new Promise((resolve, reject) => {
        req.file.stream.pipe(result).on('finish', resolve).on('error', reject);
      });
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