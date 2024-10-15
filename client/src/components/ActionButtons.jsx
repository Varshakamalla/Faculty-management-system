import React from "react";
import axios from "axios";

export default function ActionButtons({ className, notificationId, status }) {
    const [state, setState] = React.useState(status);

  async function updateStatus(status) {
    const req = await axios.put("/api/leave/update-status", {
      status,
      id: notificationId,
    });

    if (req.status === 200 || req.status === 304) {
        console.log("Status updated successfully");
        setState(status);
    }
  }
  if (state === "Pending")
    return (
      <div className={`space-x-6 ${className}`}>
        <button
          onClick={() => updateStatus("Accepted")}
          className="bg-green-500 rounded px-4 py-1 text-white font-semibold hover:bg-green-600"
        >
          Accept
        </button>
        <button
          onClick={() => updateStatus("Declined")}
          className="bg-red-600 rounded px-4 py-1 text-white font-semibold hover:bg-red-700"
        >
          Reject
        </button>
      </div>
    );

  if (state === "Accepted")
    return (
      <h1 className={`font-bold text-green-500 ${className}`}>{state}</h1>
    );

  if (state === "Declined")
    return <h1 className={`font-bold text-red-600 ${className}`}>{state}</h1>;
}
