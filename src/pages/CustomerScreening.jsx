import { useState } from "react";
import api from "../services/api";
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
              <tr key={item.subjectId || index}>
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
    </div>
  );
}