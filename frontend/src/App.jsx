import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import Attendance from "./pages/Attendance";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashbaord";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-right" />
      <Routes>
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/new" element={<AddEmployee />} />
        <Route path="/employees/:id/edit" element={<EditEmployee />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}
