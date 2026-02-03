import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";


export default function AddEmployee() {
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const [loading, setLoading] = useState(false);

  const generateId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 6; i++) {
      id += chars[Math.floor(Math.random() * chars.length)];
    }
    setForm({ ...form, employee_id: id });
  };

  const submit = async () => {
    if (!form.employee_id || !form.full_name || !form.email || !form.department) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await api.post("/employees/", form);
      toast.success("Employee created successfully");

      setForm({
        employee_id: "",
        full_name: "",
        email: "",
        department: "",
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Failed to create employee";

      if (
        typeof msg === "string" &&
        msg.toLowerCase().includes("employee id")
      ) {
        toast.error(
          "Employee with this ID already exists"
        );
      } else if (
        typeof msg === "string" &&
        msg.toLowerCase().includes("email")
      ) {
        toast.error(
          "Employee with this email already exists"
        );
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">
        Add Employee
      </h2>

      {/* Employee ID */}
      <div className="mb-3">
        <label className="text-sm text-gray-600 mb-1 block">
          Employee ID
        </label>
        <div className="flex gap-2">
          <input
            value={form.employee_id}
            onChange={(e) =>
              setForm({ ...form, employee_id: e.target.value })
            }
            className="flex-1 border rounded px-3 py-2"
            placeholder="Enter or generate ID"
          />
          <button
            type="button"
            onClick={generateId}
            className="border px-3 py-2 rounded text-sm hover:bg-gray-100"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Full Name */}
      <Input
        label="Full Name"
        value={form.full_name}
        onChange={(v) =>
          setForm({ ...form, full_name: v })
        }
      />

      {/* Email */}
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) =>
          setForm({ ...form, email: v })
        }
      />

      {/* Department */}
      <Input
        label="Department"
        value={form.department}
        onChange={(v) =>
          setForm({ ...form, department: v })
        }
      />

      <button
        disabled={loading}
        onClick={submit}
        className="bg-black text-white px-5 py-2 rounded mt-3 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Create Employee"}
      </button>
    </div>
  );
}

/* ===== Reusable Input ===== */
function Input({ label, value, onChange, type = "text" }) {
  return (
    <div className="mb-3">
      <label className="block text-sm text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
