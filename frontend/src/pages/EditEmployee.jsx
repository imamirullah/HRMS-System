import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/employees/${id}/detail/`)
      .then((res) => setForm(res.data.data))
      .catch(() => toast.error("Failed to load employee"))
      .finally(() => setLoading(false));
  }, [id]);

  const update = async () => {
    try {
      await api.put(`/employees/${id}/`, form);
      toast.success("Employee updated successfully");
      navigate("/employees");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Update failed";

      // 👇 Custom employee_id error
      if (
        typeof msg === "string" &&
        msg.toLowerCase().includes("employee id")
      ) {
        toast.error(
          "This employee ID is already available, please use a different one"
        );
      } else {
        toast.error(msg);
      }
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!form)
    return (
      <p className="p-6 text-red-500">
        Employee not found
      </p>
    );

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-xl font-semibold mb-4">
        Edit Employee
      </h2>

      {/* Employee ID */}
      <Input
        label="Employee ID"
        value={form.employee_id}
        onChange={(v) =>
          setForm({ ...form, employee_id: v })
        }
      />

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
        onClick={update}
        className="bg-black text-white px-5 py-2 rounded mt-3 hover:bg-gray-800"
      >
        Update Employee
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
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
      />
    </div>
  );
}
