import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<EmployeesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
