import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import LeaveRouter from "./routes/leaveRequest.route.js";
import { socket } from "./libs/socket.js";

import cors from 'cors';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/leave", LeaveRouter);

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'],
}));
app.options('*', cors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, message, statusCode });
});


app.get("/getStudents", async (req, res) => {
  const { class: selectedClass } = req.query;
  try {
    const students = await Student.find({ class: selectedClass });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/updateAttendance", async (req, res) => {
  const { rollno, status, date, subject, class: selectedClass } = req.body;

  try {
    const student = await Student.findOne({ rollno, class: selectedClass });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendanceData = {
      subject,
      status,
      date
    };

    student.attendance.push(attendanceData);
    await student.save();

    res.json({ message: "Attendance updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const studentSchema = new mongoose.Schema({
  rollno: String,
  name: String,
  class: String,
  attendance: [
    {
      subject: String,
      status: String,
      date: Date
    }
  ]
});

const Student = mongoose.model("Student", studentSchema);
app.get("/downloadAttendance", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const Schedule = mongoose.model('Schedule', {
  employeeId: String,
  day: String,
  subject: String,
  time: String,
  block: String
});

app.get('/api/myschedule', (req, res) => {
  const day = req.query.day;
  const employeeId = req.query.employeeId;

  Schedule.find({ day, employeeId })
    .then(schedules => {
      res.json(schedules);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ message: 'Error fetching schedule' });
    });
});


app.put('/api/myschedule/update', async (req, res) => {
  const { employeeId, day, updatedSchedule } = req.body;

  try {
    for (const item of updatedSchedule) {
      await Schedule.findOneAndUpdate(
        { employeeId, day, time: item.time },
        { $set: { subject: item.subject, block: item.block } },
        { new: true }
      );
    }
    const updatedSchedules = await Schedule.find({ employeeId, day });
    res.json({ message: 'Schedule updated successfully', schedule: updatedSchedules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/myschedule/add', async (req, res) => {
  const { employeeId, day, time, subject, block } = req.body;

  try {
    const newSchedule = new Schedule({
      employeeId,
      day,
      time,
      subject,
      block
    });

    await newSchedule.save();

    const updatedSchedules = await Schedule.find({ employeeId, day });
    res.json({ message: 'Schedule added successfully', schedule: updatedSchedules });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

socket(server);