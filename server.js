const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware for parsing incoming form data
app.use(express.urlencoded({ extended: true }));

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Set destination to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original filename
  }
});

const upload = multer({ storage: storage });

// Route to handle file uploads
app.post('/upload', upload.single('video'), (req, res) => {
  console.log('File uploaded:', req.file.filename);
  res.redirect('/');
});

// Route to render homepage and display uploaded videos
app.get('/', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      // Pass error to the view if there's an issue
      return res.render('index', { videos: [], error: 'Error reading uploaded files.' });
    }
    // Pass videos array to the view (even if it's empty)
    res.render('index', { videos: files, error: null });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
