import { LeaveRequest } from "../models/leaveRequest.model.js";
import { format } from "date-fns";

export const getLeaveRequest = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find().sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  const { status, id } = req.body;

  try {
    const leaveRequest = await LeaveRequest.findById(id);
    leaveRequest.status = status;
    await leaveRequest.save();
    res.status(200).json(leaveRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLeaveRequest = async (data) => {
  try {
    const startDate = format(new Date(data.startDate), "dd-MM-yyyy");
    const endDate = format(new Date(data.endDate), "dd-MM-yyyy");

    data = { ...data, startDate, endDate };

    const dbReq = await LeaveRequest.create(data);

    return dbReq;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteLeaveRequest = async (req, res) => {
  const { id } = req.params;

  try {
    await LeaveRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
