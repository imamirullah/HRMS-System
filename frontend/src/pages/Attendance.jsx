import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import api from "../services/api";

export default function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    status: "Present",
  });

  useEffect(() => {
    api.get("/employees/").then(res => {
      setEmployees(res.data.data);
    });
  }, []);

  const submit = async () => {
    try {
      await api.post("/attendance/", form);
      toast.success("Attendance marked successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>

      <select
        className="w-full border p-2 rounded mb-3"
        onChange={e => setForm({ ...form, employee_id: e.target.value })}
      >
        <option value="">Select Employee</option>
        {employees.map(emp => (
          <option key={emp.id} value={emp.employee_id}>
            {emp.full_name} ({emp.employee_id})
          </option>
        ))}
      </select>

      <input
        type="date"
        className="w-full border p-2 rounded mb-3"
        onChange={e => setForm({ ...form, date: e.target.value })}
      />

      <select
        className="w-full border p-2 rounded mb-3"
        onChange={e => setForm({ ...form, status: e.target.value })}
      >
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>

      <button
        onClick={submit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
}
