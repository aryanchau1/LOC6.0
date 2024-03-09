const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const pool = require("./db");

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
    req.uploadedFileName = filename; // Store the filename in the request object
    cb(null, filename);
  }
});

const uploadWithStorage = multer({ storage: storage });

// Route to handle file upload
app.post('/photographer', uploadWithStorage.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const { roomType, roomNo, request, comment } = req.body;

  if (request === "BedRoom") {
    // Call three models
    const mess_api = `http://127.0.0.1:5000/messy_predict`;
    try {
      // Send the filename to Flask server
      const response = await axios.post(mess_api, { imageUrl: req.uploadedFileName }, {
        headers: {
          'Content-Type': 'application/json' // Set content type to JSON
        }
      });
      const messy = response.data.result;

      // Insert data into PostgreSQL database
      const insertQuery = `
        INSERT INTO clean_req (room_number, room_type, status, image_url, request_date_time, completion_date_time, comment, messy) 
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, null, $5, $6)
      `;
      const values = [roomNo, roomType, 0, req.uploadedFileName, comment, messy];
      await pool.query(insertQuery, values);
    } catch (error) {
      console.error("Error:", error.message);
    }
  } else if (request === "Washroom") {
    // Call one API
    console.log("Not made yet!!");
  }

  res.json({
    filename: req.uploadedFileName, // Send the uploaded filename in the response
    roomType,
    roomNo,
    request,
    comment
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
