import { useState } from "react";
import api from "../services/api";
import SubjectDetailsModal from "../pages/SubjectDetailsModal";
import "../styles/CustomerScreening.css";

export default function CustomerScreening() {
  const [form, setForm] = useState({
    fullName: "",
    documentNumber: "",
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  // Subject details modal state
  const [showModal, setShowModal] = useState(false);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectError, setSubjectError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    if (!form.fullName && !form.documentNumber) {
      setError("Please enter a name or document number.");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await api.post("/screening/customer", {
        fullName: form.fullName,
        documentNumber: form.documentNumber,
        includeRawData: false,
      });

      if (response.data.success) {
        setResults(response.data.data || []);
      } else {
        setError(response.data.message || "Screening request failed.");
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to reach the screening API. Please try again."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleRowClick = async (subjectId) => {
    if (!subjectId) return;

    setShowModal(true);
    setSubjectLoading(true);
    setSubjectError("");
    setSubjectDetails(null);

    try {
      const response = await api.get(`/screening/subject/${subjectId}`);

      if (response.data.success) {
        setSubjectDetails(response.data.data);
      } else {
        setSubjectError(response.data.message || "Failed to load subject details.");
      }
    } catch (err) {
      console.error(err);
      setSubjectError(
        err.response?.data?.message ||
          "Unable to load subject details. Please try again."
      );
    } finally {
      setSubjectLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubjectDetails(null);
    setSubjectError("");
  };

  return (
    <div className="screening-page">
      <h2>Customer Screening</h2>

      <div className="screening-form">
        <input
          type="text"
          name="fullName"
          placeholder="Customer Full Name"
          value={form.fullName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <input
          type="text"
          name="documentNumber"
          placeholder="NIC / Document Number"
          value={form.documentNumber}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="result-table">
        <table>
          <thead>
            <tr>
              <th>Matched Name</th>
              <th>Document Number</th>
              <th>Match Type</th>
              <th>Match Score</th>
              <th>List Type</th>
              <th>Subject Type</th>
              <th>Reference No.</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {results.length === 0 && searched && !loading && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No matches found.
                </td>
              </tr>
            )}

            {results.map((item, index) => (
              <tr
                key={item.subjectId || index}
                className="clickable-row"
                onClick={() => handleRowClick(item.subjectId)}
                title="Click to view full subject details"
              >
                <td>{item.matchedName}</td>
                <td>{item.matchedDocumentNumber}</td>
                <td>{item.matchType}</td>
                <td
                  className={
                    item.matchScore >= 90
                      ? "high"
                      : item.matchScore >= 60
                      ? "medium"
                      : "low"
                  }
                >
                  {item.matchScore}%
                </td>
                <td>{item.listType}</td>
                <td>{item.subjectType}</td>
                <td>{item.referenceNumber}</td>
                <td>{item.matchFound ? "Potential Match" : "No Match"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <SubjectDetailsModal
          subject={subjectDetails}
          loading={subjectLoading}
          error={subjectError}
          onClose={closeModal}
        />
      )}
    </div>
  );
}