import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import CustomerScreening from "./pages/CustomerScreening";
import BulkUpload from "./pages/BulkUpload";
import XmlUpload from "./pages/XmlUpload";
import HighRisk from "./pages/HighRisk";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/screening" element={<CustomerScreening />} />

      <Route path="/bulk-upload" element={<BulkUpload />} />

      <Route path="/xml-upload" element={<XmlUpload />} />

      <Route
    path="/high-risk"
    element={<HighRisk />}
/>
    </Routes>
  );
}

export default App;
