import { NavLink } from "react-router-dom";

const navLink = ({ isActive }) => ({
  padding: "10px 12px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 600,
  color: isActive ? "white" : "#111827",
  background: isActive ? "#111827" : "transparent",
});

export default function Layout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb" }}>
      <header style={{ background: "white", borderBottom: "1px solid #e5e7eb" }}>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 800 }}>HRMS Lite</div>

          <nav style={{ display: "flex", gap: 10 }}>
            <NavLink to="/" end style={navLink}>
              Employees
            </NavLink>
            <NavLink to="/attendance" style={navLink}>
              Attendance
            </NavLink>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
        {children}
      </main>
    </div>
  );
}
