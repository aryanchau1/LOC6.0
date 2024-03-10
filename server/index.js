const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const pool = require("./db");
const { table } = require("console");

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
app.get("/room-service-request",async(req,res)=>{
  const type = req.query.requestType;
  let Rows;
  try{
    if(type === "Cleaner" ){
      const cleanQuery = `
        SELECT *
        FROM clean_req
        WHERE status = 0
        ORDER BY request_date_time DESC;
      `;
      const cleanRows = await pool.query(cleanQuery);
      Rows =  cleanRows.rows;
    }
    else if(type === "Refill"){
      const refillQuery = `
        SELECT *
        FROM refill_req
        ORDER BY upload_date_time DESC;
      `;
      const refillRows = await pool.query(refillQuery);
      Rows =  refillRows.rows;
    }
    else if(type === "Repair"){
      const repairQuery = `
        SELECT *
        FROM repair_req
        WHERE status = 0
        ORDER BY request_date_time DESC;
      `;
      const repairRows = await pool.query(repairQuery);
      Rows =  repairRows.rows;
    }
    res.send(Rows);
  }catch(e){
    res.status(500).send(e.message);
    console.log(e.message);
  }
})
app.get("/get-tables", async (req, res) => {
  try {
    const roomType = req.query.roomType;
    const reqType = req.query.request;
    let tablesData = {};
    // Fetch data from the 'refill_req' table
      const refillQuery = `
        SELECT *
        FROM refill_req
        WHERE room_type = $1
        ORDER BY upload_date_time DESC;
      `;
      const refillRows = await pool.query(refillQuery, [roomType]);
      tablesData.refill_req = refillRows.rows;
    
    // Fetch data from the 'clean_req' table
      const cleanQuery = `
        SELECT *
        FROM clean_req
        WHERE room_type = $1
        ORDER BY request_date_time DESC;
      `;
      const cleanRows = await pool.query(cleanQuery, [roomType]);
      tablesData.clean_req = cleanRows.rows;
    
    // Fetch data from the 'repair_req' table
      const repairQuery = `
        SELECT *
        FROM repair_req
        WHERE room_type = $1
        ORDER BY request_date_time DESC;
      `;
      const repairRows = await pool.query(repairQuery, [roomType]);
      tablesData.repair_req = repairRows.rows;

    res.send(tablesData);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
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
    if (request === "micro") {
      try {
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
        console.log(damage);
        const damageQuery = `
          INSERT INTO repair_req (room_number, room_type, status, request_date_time, completion_date_time, image_url, comment, req_stain, req_break)
          VALUES ($1, $2, 0, CURRENT_TIMESTAMP, null, $3, $4, $5, $6)
        `;
        const damage_values = [
          roomNo,
          roomType,
          req.uploadedFileName,
          comment,
          damage.result.stain,
          damage.result.damage,
        ];
        await pool.query(damageQuery, damage_values);
      } catch (error) {
        console.error("Error:", error.message);
        // Handle error appropriately, such as sending an error response
        return res.status(500).json({ error: "Internal Server Error" });
      }
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
