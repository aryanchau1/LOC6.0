const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files

// Serve uploaded files statically (optional)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());

// Define the destination folder and filename for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    const date = new Date().toISOString().replace(/:/g, '-'); // Get current date and replace colons to avoid filename issues
    const filename = `${date}-${file.originalname}`; // Append date to the original filename
    cb(null, filename);
  }
});

const uploadWithStorage = multer({ storage: storage });

// Route to handle file upload
app.post('/photographer', uploadWithStorage.single('file'), (req, res) => {
  // Access the uploaded file via req.file
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // You can access other form data sent along with the file upload via req.body
  const { roomType, roomNo, request, comment } = req.body;
  
  console.log("Uploaded");
  res.json({
    filename: req.file.filename,
    roomType,
    roomNo,
    request,
    comment
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
