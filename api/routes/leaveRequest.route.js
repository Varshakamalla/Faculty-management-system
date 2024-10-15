import {Router} from "express";
import { getLeaveRequest, updateStatus } from "../controllers/leaveRequest.controller.js";

const LeaveRouter = Router();

LeaveRouter.get("/", getLeaveRequest);
LeaveRouter.put("/update-status", updateStatus);

export default LeaveRouter;
