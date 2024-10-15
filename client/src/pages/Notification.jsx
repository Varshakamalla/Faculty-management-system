import React, { useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ActionButtons from "../components/ActionButtons";
import { resetNewNotification } from "../redux/notification/notification";

const socket = io.connect("http://localhost:3000");

export default function Notification() {
  const [notifications, setNotifications] = React.useState([]);

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    async function get() {
      const req = await axios.get("/api/leave/");

      if (req.status === 200 || req.status === 304) {
        const filterData = req.data.filter(
          (data) =>
            data.email === currentUser.email ||
            data.toEmail === currentUser.email
        );
        setNotifications(filterData);
      }
    }

    get();

    dispatch(resetNewNotification());
  }, []);

  useEffect(() => {
    console.log(notifications);
    socket.on("receive_message", (data) => {
      if (data.toEmail !== currentUser.email) return;
      setNotifications((prev) => {
        console.log(prev);
        return [data, ...prev];
      });
    });
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB"); // 'en-GB' formats the date as day/month/year
  };

  if (notifications.length === 0)
    return (
      <h1 className="text-center pt-10 text-lg font-bold">No notifications</h1>
    );

  return (
    <div>
      <h1 className="text-center pt-10 text-lg font-bold">Notifications</h1>
      <div className="p-4 w-full flex flex-col items-center justify-center pt-10 space-y-6">
        {notifications.map((notification, index) => {
          return (
            <div
              className="p-4 shadow-xl rounded w-full md:w-3/4 border"
              key={notification._id}
            >
              {currentUser.email === notification.email && (
                <div className=" font-semibold md:hidden pb-2 space-x-1 flex">
                  <h1>Your Request is</h1>
                  {notification.status == "Accepted" && (
                    <h1 className="text-green-600">Approved</h1>
                  )}
                  {notification.status == "Declined" && (
                    <h1 className="text-red-600">Rejected</h1>
                  )}
                  {notification.status == "Pending" && (
                    <h1 className="text-yellow-600">Pending</h1>
                  )}
                </div>
              )}
              <div className="flex justify-between ">
                <div className=" flex md:justify-normal justify-between space-x-6">
                  <div>
                    <h1 className="text-slate-600 font-semibold">
                      {notification.userName}
                    </h1>
                    <h1 className="text-slate-500 text-sm">
                      {notification.email}
                    </h1>
                  </div>
                </div>
                <p className="text-slate-600 text-sm sm:block flex items-center flex-col">
                  {notification.startDate}
                  <span className="font-bold px-2">to</span>{" "}
                  {notification.endDate}
                </p>

                {currentUser.email !== notification.email ? (
                  <ActionButtons
                    notificationId={notification._id}
                    status={notification.status}
                    className="md:block hidden"
                  />
                ) : (
                  <div className=" font-semibold md:flex hidden pb-2 space-x-1">
                    <h1>Your Request is</h1>
                    {notification.status == "Accepted" && (
                      <h1 className="text-green-600">Approved</h1>
                    )}
                    {notification.status == "Declined" && (
                      <h1 className="text-red-600">Rejected</h1>
                    )}
                    {notification.status == "Pending" && (
                      <h1 className="text-yellow-600">Pending</h1>
                    )}
                  </div>
                )}
              </div>
              <br />
              <h1 className="text-slate-800 text-justify">
                {notification.reason}
              </h1>

              {currentUser.email !== notification.email && (
                <ActionButtons
                  status={notification.status}
                  notificationId={notification._id}
                  className="md:hidden block mt-4"
                />
              )}

              <p className="text-xs text-slate-500 pt-1">Posted at {formatDate(notification.createdAt)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
