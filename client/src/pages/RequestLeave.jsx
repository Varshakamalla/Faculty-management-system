import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
const socket = io("localhost:3000");

const RequestLeave = () => {
  const { currentUser } = useSelector((state) => state.user);
  const initialState = {
    startDate: "",
    endDate: "",
    reason: "",
    userName: currentUser.username,
    email: currentUser.email,
    toEmail: "",
  };

  const [leaveRequest, setLeaveRequest] = useState(initialState);

  const [leaveRequested, setLeaveRequested] = useState(0);
  const [leaveApproved, setLeaveApproved] = useState(0);
  const [leavePending, setLeavePending] = useState(0);

  const handleInputChange = (e) => {
    setLeaveRequest({ ...leaveRequest, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    /*const today = new Date();
    const minDate = new Date(today.getTime() + (48 * 60 * 60 * 1000)); // 2 days from now
    const startDate = new Date(leaveRequest.startDate);
    if (startDate < minDate) {
      alert("Leave request must be submitted at least 2 days in advance.");
      return;
    }*/
    

    setLeaveRequested((prev) => prev + 1);
    setLeaveApproved((prev) => prev + 1);

    socket.emit("send_message", leaveRequest);

    setLeaveRequest(initialState);
    alert("Leave request submitted successfully");
  };

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch("http://localhost:3000/leave-data");
        const data = await response.json();

        setLeaveRequested(data.leaveRequested);
        setLeaveApproved(data.leaveApproved);
        setLeavePending(data.leavePending);
      } catch (error) {
        console.error("Error fetching leave data:", error);
      }
    };

    fetchLeaveData();
  }, []);

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-slate-700">
        Request Leave
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="startDate"
            className="block mb-2 font-semibold text-slate-600"
          >
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={leaveRequest.startDate}
            onChange={handleInputChange}
            min={new Date(new Date().getTime() + (48 * 60 * 60 * 1000)).toISOString().slice(0, 10)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="endDate"
            className="block mb-2 font-semibold text-slate-600"
          >
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={leaveRequest.endDate}
            onChange={handleInputChange}
            min={new Date(new Date().getTime() + (48 * 60 * 60 * 1000)).toISOString().slice(0, 10)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="toEmail"
            className="block mb-2 font-semibold text-slate-600"
          >
            To Email
          </label>
          <input
            type="email"
            id="toEmail"
            name="toEmail"
            value={leaveRequest.toEmail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="reason"
            className="block mb-2 font-semibold text-slate-600"
          >
            Reason
          </label>
          <textarea
            id="reason"
            name="reason"
            value={leaveRequest.reason}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Submit
          </button>
        </div>
      </form>
      <div className="mt-4 text-slate-700">
        <p>Leaves Requested: {leaveRequested}</p>
      </div>
    </div>
  );
};

export default RequestLeave;