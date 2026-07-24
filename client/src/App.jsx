import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import QRPage from "./pages/QRPage";
import BillPage from "./pages/BillPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/qr/:id" element={<QRPage />} />
          <Route path="/bill/:id" element={<BillPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
