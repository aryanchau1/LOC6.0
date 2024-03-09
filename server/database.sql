-- Create the database
CREATE DATABASE hotel_management;

-- Connect to the newly created database
\c hotel_management

-- Create the clean_req table
CREATE TABLE clean_req (
    room_number VARCHAR(10),
    room_type VARCHAR(10),
    status INT CHECK (status IN (0, 1, 2)),
    image_url VARCHAR(255),
    request_date_time TIMESTAMP,
    completion_date_time TIMESTAMP,
    comment VARCHAR(255),
    messy FLOAT
);

-- Create the refill_req table
CREATE TABLE refill_req (
    room_number VARCHAR(10),
    room_type VARCHAR(10),
    upload_date_time TIMESTAMP,
    image_url VARCHAR(255),
    comment VARCHAR(255),
    is_present VARCHAR(255)
);

-- Create the repair_req table
CREATE TABLE repair_req (
    room_number VARCHAR(10),
    room_type VARCHAR(10),
    status INT CHECK (status IN (0, 1, 2)),
    request_date_time TIMESTAMP,
    completion_date_time TIMESTAMP,
    image_url VARCHAR(255),
    comment VARCHAR(255),
    req_stain VARCHAR(255),
    req_break VARCHAR(255)
);
