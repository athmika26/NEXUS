
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose=require('mongoose');
const authRoutes=require('./routes/auth');
const notesRouter = require('./routes/notes');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
const mongoURI=process.env.MONGOURL;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
mongoose.connect(mongoURI, {dbName: 'Nexus'});
app.get("/", (req, res) => {
    res.render("helloo"); // No need to specify .html, EJS looks for .ejs files by default
});
app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get("/login", (req, res) => {
    res.render("login"); 
});

app.get("/home", (req, res) => {
    res.render("home"); 
});
app.use("/auth",authRoutes);
app.use("/notes",notesRouter);
app.listen(port, () => console.log(`Server is running on port ${port}`));
