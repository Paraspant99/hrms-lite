import { useEffect, useState } from "react";
import { request } from "../api/client";

const card = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: 14,
  padding: 14,
};

const input = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
};

const btn = {
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #111827",
  background: "#111827",
  color: "white",
  cursor: "pointer",
  fontWeight: 800,
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const [form, setForm] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    department: "",
  });

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await request("/api/employees");
      setEmployees(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addEmployee(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await request("/api/employees", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ employeeId: "", fullName: "", email: "", department: "" });
      await load();
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(id) {
    const ok = confirm("Delete this employee? Attendance will also be deleted.");
    if (!ok) return;
    setErr("");
    setSaving(true);
    try {
      await request(`/api/employees/${id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Employees</h1>

      {err && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fecaca",
            padding: 12,
            borderRadius: 12,
          }}
        >
          {err}
        </div>
      )}

      <section style={card}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Add Employee</h2>

        <form
          onSubmit={addEmployee}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label style={{ fontSize: 12 }}>Employee ID</label>
            <input
              style={input}
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: 12 }}>Full Name</label>
            <input
              style={input}
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: 12 }}>Email</label>
            <input
              style={input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: 12 }}>Department</label>
            <input
              style={input}
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              required
            />
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <button style={btn} disabled={saving}>
              {saving ? "Saving..." : "Add Employee"}
            </button>
          </div>
        </form>
      </section>

      <section style={card}>
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Employee List</h2>

        {loading ? (
          <div style={{ color: "#6b7280" }}>Loading...</div>
        ) : employees.length === 0 ? (
          <div style={{ color: "#6b7280" }}>No employees yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th style={{ padding: "10px 8px" }}>Employee ID</th>
                <th style={{ padding: "10px 8px" }}>Name</th>
                <th style={{ padding: "10px 8px" }}>Email</th>
                <th style={{ padding: "10px 8px" }}>Department</th>
                <th style={{ padding: "10px 8px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td style={{ padding: "10px 8px" }}>{emp.employeeId}</td>
                  <td style={{ padding: "10px 8px" }}>{emp.fullName}</td>
                  <td style={{ padding: "10px 8px" }}>{emp.email}</td>
                  <td style={{ padding: "10px 8px" }}>{emp.department}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <button
                      onClick={() => deleteEmployee(emp.id)}
                      disabled={saving}
                      style={{
                        padding: "8px 10px",
                        borderRadius: 10,
                        border: "1px solid #ef4444",
                        background: "white",
                        color: "#b91c1c",
                        cursor: "pointer",
                        fontWeight: 800,
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
