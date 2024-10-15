import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoIosNotifications } from "react-icons/io";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const state = useSelector((state) => state.notification.newNotification);
  console.log(state)

  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="text-2xl font-bold ">CVR COLLEGE OF ENGINEERING</h1>
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            <li>Home</li>
          </Link>
          {currentUser && (
            <Link to="/notifications">
              <div className="relative">
                <IoIosNotifications className="h-6 w-7" />
                {state && (
                  <div className="absolute top-0 left-0 h-1 w-1 bg-red-500 rounded-full"></div>
                )}
              </div>
            </Link>
          )}
          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.profilePicture}
                alt="profile"
                className="h-7 w-7 rounded-full object-cover"
              />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
}
