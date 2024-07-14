const express = require('express');
const router = express.Router();
const Note = require('../models/note');
const authenticateJWT = require('../middleware/jwt');

// Get all notes
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const notes = await Note.find({ isArchived: false, user: req.user.id }).sort({ createdAt: -1 });
    res.render('home', { notes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get archived notes
router.get('/archive', authenticateJWT, async (req, res) => {
  try {
    const notes = await Note.find({ isArchived: true, user: req.user.id }).sort({ createdAt: -1 });
    res.render('archive', { notes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/edit/:id', async (req, res) => {
  try {
      const noteId = req.params.id;
      const note = await Note.findById(noteId);
      if (!note) {
          return res.status(404).json({ message: 'Note not found' });
      }
      res.json(note);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch note' });
  }
});

// Update a note
router.post('/edit/:id', async (req, res) => {
  try {
      const noteId = req.params.id;
      const { title, content } = req.body;
      const updatedNote = await Note.findByIdAndUpdate(noteId, { title, content }, { new: true });
      if (!updatedNote) {
          return res.status(404).json({ message: 'Note not found' });
      }
      res.json(updatedNote);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update note' });
  }
});

// Archive a note
router.post('/:id/archive', authenticateJWT, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id.toString()) {
      return res.status(404).send('Note not found or unauthorized');
    }
    note.isArchived = true;
    await note.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Unarchive a note
router.post('/:id/unarchive', authenticateJWT, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note || note.user.toString() !== req.user.id.toString()) {
      return res.status(404).send('Note not found or unauthorized');
    }
    note.isArchived = false;
    await note.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create a new note
router.post('/add', authenticateJWT, async (req, res) => {
  const { title, content } = req.body;
  const user = req.user.id;
  try {
    await Note.create({ title, content, user });
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a note
router.post('/delete/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note || note.user.toString() !== req.user.id.toString()) {
      return res.status(404).send('Note not found or unauthorized');
    }
    await Note.findByIdAndDelete(id);
    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
