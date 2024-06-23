const express = require('express');
const router = express.Router();
const Note = require('../models/note');

// Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.render('home', { notes }); // Assuming your EJS file is named home.ejs
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Create a new note
router.post('/add', async (req, res) => {
    const { title, content } = req.body;
    await Note.create({ title, content });
    res.redirect('/');
});

// Delete a note
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.redirect('/');
});

// Edit a note (Get note data)
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const note = await Note.findById(id);
    res.render('edit', { note });
});

// Update a note
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    await Note.findByIdAndUpdate(id, { title, content });
    res.redirect('/');
});

module.exports = router;
