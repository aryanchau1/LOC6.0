const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const pool = require("./db");

const app = express();
const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploaded files

// Serve uploaded files statically (optional)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());

// Define the destination folder and filename for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    const date = new Date().toISOString().replace(/:/g, "-"); // Get current date and replace colons to avoid filename issues
    const filename = `${date}-${file.originalname}`; // Append date to the original filename
    req.uploadedFileName = filename; // Store the filename in the request object
    cb(null, filename);
  },
});

const uploadWithStorage = multer({ storage: storage });
//handle fetch request by admin
app.get("/get-tables", async (req, res) => {
  try {
    var rows = "";
    const roomType = req.query.roomType;
    if (roomType === "*") {
      const query = `
        SELECT *
        FROM clean_req
        ORDER BY request_date_time DESC;
      `;
      rows = await pool.query(query);
    } else {
      const query = `
        SELECT *
        FROM clean_req
        WHERE room_type = ($1)
        ORDER BY request_date_time DESC
        ;
      `;
      rows = await pool.query(query, [roomType]);
    }

    res.send(rows);
  } catch (error) {
    console.error("Error:", error.message);
  }
});

// Route to handle file upload
app.post(
  "/photographer",
  uploadWithStorage.single("file"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const { roomType, roomNo, request, comment, type } = req.body;
    console.log(type);
    if (request === "BedRoom") {
      // Call three models
      const mess_api = `http://127.0.0.1:5000/messy_predict`;
      const detect_api = `http://127.0.0.1:5000/detect_objects`;
      try {
        const response_detect = await axios.post(
          detect_api,
          { imageUrl: req.uploadedFileName },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const detect = response_detect.data;
        const response_messy = await axios.post(
          mess_api,
          { imageUrl: req.uploadedFileName },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const messy = response_messy.data.result;
        // Insert data into PostgreSQL database for messy
        const insertQuery = `
        INSERT INTO clean_req (room_number, room_type, status, image_url, request_date_time, completion_date_time, comment, messy) 
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, null, $5, $6)
      `;
        const values = [
          roomNo,
          roomType,
          0,
          req.uploadedFileName,
          comment,
          messy,
        ];
        await pool.query(insertQuery, values);
        //Insert data into the refill database
        const refillQuery = `
        INSERT INTO refill_req (room_number,room_type ,upload_date_time,image_url,comment,is_present)
        VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5)
      `;
        const detect_values = [
          roomNo,
          roomType,
          req.uploadedFileName,
          comment,
          detect,
        ];
        await pool.query(refillQuery, detect_values);
      } catch (error) {
        console.error("Error:", error.message);
        console.log(res.data);
      }
    } else if (request === "Washroom") {
      const detect_api = `http://127.0.0.1:5000/detect_objects`;
      try {
        const response_detect = await axios.post(
          detect_api,
          { imageUrl: req.uploadedFileName },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response_detect);
        const detect = response_detect.data;
        const refillQuery = `
        INSERT INTO refill_req (room_number,room_type ,upload_date_time,image_url,comment,is_present)
        VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, $5)
      `;
        const detect_values = [
          roomNo,
          roomType,
          req.uploadedFileName,
          comment,
          detect,
        ];
        await pool.query(refillQuery, detect_values);
      } catch (e) {
        console.log(e.message);
      }
    } 
    if(type === "micro") {
      // New condition for "Micro" type
      const damage_api = `http://127.0.0.1:5000/damage_detection`;
      const response_damage = await axios.post(
        damage_api,
        { imageUrl: req.uploadedFileName },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const damage = response_damage.data;
      console.log(damage)
    }

    res.json({
      filename: req.uploadedFileName, // Send the uploaded filename in the response
      roomType,
      roomNo,
      request,
      comment,
    });
  }
);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
