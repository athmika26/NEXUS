const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({ isArchived: false, user: req.user._id }).sort({ createdAt: -1 });
        res.render('home', { notes }); // Assuming your EJS file is named home.ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get archived notes
router.get('/archive', async (req, res) => {
    try {
        const notes = await Note.find({ isArchived: true, user: req.user._id }).sort({ createdAt: -1 });
        res.render('home', { notes }); // Assuming your EJS file is named home.ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Archive a note
router.post('/:id/archive', async (req, res) => {
    try {
        console.log(req.params.id);
        const note = await Note.findById(req.params.id);
        if (!note || note.user.toString() !== req.user._id.toString()) {
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

// Create a new note
router.post('/add', async (req, res) => {
    const { title, content } = req.body;
    const user = req.user._id;
    try {
        await Note.create({ title, content, user });
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete a note
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const note = await Note.findById(id);
        if (!note || note.user.toString() !== req.user._id.toString()) {
            return res.status(404).send('Note not found or unauthorized');
        }
        await Note.findByIdAndDelete(id);
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Edit a note (Get note data)
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Editing note ID: ${id}`);
        const note = await Note.findById(id);
        if (!note || note.user.toString() !== req.user._id.toString()) {
            console.error(`Note with ID ${id} not found or unauthorized`);
            return res.status(404).send('Note not found or unauthorized');
        }
        console.log('Note found:', note); // Debug log
        res.render('edit', { title: 'Edit Note', note: note });
    } catch (err) {
        console.error(`Error fetching note with ID ${id}:`, err);
        res.status(500).send('Server Error');
    }
});

// Update a note
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const note = await Note.findById(id);
        if (!note || note.user.toString() !== req.user._id.toString()) {
            return res.status(404).send('Note not found or unauthorized');
        }
        note.title = title;
        note.content = content;
        await note.save();
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
