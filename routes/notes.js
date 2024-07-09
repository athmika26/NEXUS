const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find({ isArchived: false }).sort({ createdAt: -1 });
        res.render('home', { notes }); // Assuming your EJS file is named home.ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get archived notes
router.get('/archive', async (req, res) => {
    try {
        const notes = await Note.find({ isArchived: true }).sort({ createdAt: -1 });
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
        if (!note) {
            return res.status(404).send('Note not found');
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
    await Note.create({ title, content });
    res.redirect('/home');
});

// Delete a note
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.redirect('/home');
});

// Edit a note (Get note data)
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Editing note ID: ${id}`);
        const note = await Note.findById(id);
        if (!note) {
            console.error(`Note with ID ${id} not found`);
            return res.status(404).send('Note not found');
        }
        res.render('edit', { title: 'Edit Note', note: note});
    } catch (err) {
        console.error(`Error fetching note with ID ${id}:`, err);
        res.status(500).send('Server Error');
    }
});
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Editing note ID: ${id}`);
        const note = await Note.findById(id);
        if (!note) {
            console.error(`Note with ID ${id} not found`);
            return res.status(404).send('Note not found');
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
        await Note.findByIdAndUpdate(id, { title, content });
        res.redirect('/home');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
