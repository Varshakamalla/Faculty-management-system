import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import RequestLeave from "./pages/RequestLeave";
import Notification from "./pages/Notification";
import ClassSelection from "./pages/ClassSelection";
import MarkAttendance from "./pages/MarkAttendance";
import MySchedule from "./pages/MySchedule";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/request-leave" element={<RequestLeave />} />
        <Route path="/student-attendance" element={<ClassSelection />} />
        <Route path="/MarkAttendance" element={<MarkAttendance/>}/>
        <Route path="/MySchedule" element={<MySchedule/>}/>
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notification />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
