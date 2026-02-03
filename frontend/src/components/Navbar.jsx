import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white border-b px-6 py-4 flex justify-between">
      <h1 className="font-semibold text-lg">HRMS Lite</h1>
      <div className="space-x-6 text-sm">
        <Link to="/" className="hover:text-black text-gray-600">
          Dashoard
        </Link>
        <Link to="/employees" className="hover:text-black text-gray-600">
          Employees
        </Link>
        <Link to="/attendance" className="hover:text-black text-gray-600">
          Attendance
        </Link>
      </div>
    </nav>
  );
}
