import { useEffect, useMemo, useState } from "react";
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

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("PRESENT");

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({ presentDays: 0, absentDays: 0 });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  async function loadEmployees() {
    setLoading(true);
    setErr("");
    try {
      const data = await request("/api/employees");
      setEmployees(data);
      if (data.length > 0) setSelectedId(String(data[0].id));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadAttendance(empId) {
    if (!empId) return;
    setErr("");
    try {
      const [recs, sum] = await Promise.all([
        request(`/api/employees/${empId}/attendance`),
        request(`/api/employees/${empId}/attendance/summary`),
      ]);
      setRecords(recs);
      setSummary(sum);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  useEffect(() => {
    if (selectedId) loadAttendance(selectedId);
  }, [selectedId]);

  async function markAttendance(e) {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      await request("/api/attendance", {
        method: "POST",
        body: JSON.stringify({
          employeeDbId: Number(selectedId),
          date,
          status,
        }),
      });
      await loadAttendance(selectedId);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setSaving(false);
    }
  }

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const d = new Date(r.date).toISOString().slice(0, 10);
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });
  }, [records, fromDate, toDate]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Attendance</h1>

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
        <h2 style={{ marginTop: 0, fontSize: 16 }}>Mark Attendance</h2>

        {loading ? (
          <div style={{ color: "#6b7280" }}>Loading employees...</div>
        ) : employees.length === 0 ? (
          <div style={{ color: "#6b7280" }}>No employees. Add employees first.</div>
        ) : (
          <form
            onSubmit={markAttendance}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
            }}
          >
            <div>
              <label style={{ fontSize: 12 }}>Employee</label>
              <select
                style={input}
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeId} - {emp.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: 12 }}>Date</label>
              <input
                style={input}
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: 12 }}>Status</label>
              <select
                style={input}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="PRESENT">Present</option>
                <option value="ABSENT">Absent</option>
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <button style={btn} disabled={saving}>
                {saving ? "Saving..." : "Save Attendance"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section style={card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 16 }}>Records</h2>
          <div>
            Present: <b>{summary.presentDays}</b> | Absent:{" "}
            <b>{summary.absentDays}</b>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12 }}>From</label>
            <input
              style={input}
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 12 }}>To</label>
            <input
              style={input}
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div style={{ alignSelf: "end" }}>
            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
              style={{
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "white",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ color: "#6b7280" }}>No attendance records yet.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  textAlign: "left",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <th style={{ padding: "10px 8px" }}>Date</th>
                <th style={{ padding: "10px 8px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid #f3f4f6" }}
                >
                  <td style={{ padding: "10px 8px" }}>
                    {new Date(r.date).toISOString().slice(0, 10)}
                  </td>
                  <td style={{ padding: "10px 8px" }}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
