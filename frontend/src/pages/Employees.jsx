import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees/");
      setEmployees(res.data.data);
    } catch {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const removeEmployee = async (id) => {
  try {
    await api.delete(`/employees/${id}/`);
    toast.success("Employee deleted");
    loadEmployees();
  } catch {
    toast.error("Failed to delete employee");
  }
};


  useEffect(() => {
    loadEmployees();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <Link
          to="/employees/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Employee
        </Link>
        <Link
          to="/"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Dashboard
        </Link>
      </div>

      {employees.length === 0 ? (
        <p className="text-gray-500">No employees found</p>
      ) : (
        <table className="w-full bg-white border rounded">
          <thead className="bg-gray-50 text-left text-sm">
            <tr>
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Department</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-t">
                <td className="p-3">{emp.full_name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td className="p-3 text-right space-x-3">
                  <Link
                    to={`/employees/${emp.id}/edit`}
                    className="text-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => removeEmployee(emp.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
