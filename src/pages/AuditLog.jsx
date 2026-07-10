import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import "../styles/AuditLog.css";

const initialFilters = {
  requestName: "",
  documentNumber: "",
  riskLevel: "",
  matchFound: "",
  fromDate: "",
  toDate: "",
};

export default function AuditLog() {
  const [filters, setFilters] = useState(initialFilters);
  const [items, setItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const buildPayload = (page) => ({
    requestName: filters.requestName || "",
    documentNumber: filters.documentNumber || "",
    riskLevel: filters.riskLevel || "",
    matchFound: filters.matchFound === "" ? null : filters.matchFound === "true",
    fromDate: filters.fromDate ? new Date(filters.fromDate).toISOString() : null,
    toDate: filters.toDate ? new Date(filters.toDate).toISOString() : null,
    pageNumber: page,
    pageSize,
  });

  const fetchAuditLogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/screening/audit/search", buildPayload(page));
      const data = response.data?.data;

      setItems(data?.items || []);
      setPageNumber(data?.pageNumber || page);
      setTotalPages(data?.totalPages || 1);
      setTotalRecords(data?.totalRecords || 0);
    } catch (err) {
      console.error(err);
      setError("Failed to load audit logs. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pageSize]);

  useEffect(() => {
    fetchAuditLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAuditLogs(1);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setTimeout(() => fetchAuditLogs(1), 0);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchAuditLogs(page);
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return d.toLocaleString();
  };

  const riskClass = (risk) => {
    if (!risk) return "";
    return risk.toLowerCase().replace("_", "-");
  };

  return (
    <div className="audit-page">
      <div className="title-area">
        <h2>Screening Audit Log</h2>
        <p>Search and review historical customer screening requests.</p>
      </div>

      <form className="audit-filters" onSubmit={handleSearch}>
        <input
          type="text"
          name="requestName"
          placeholder="Customer Name"
          value={filters.requestName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="documentNumber"
          placeholder="Document Number"
          value={filters.documentNumber}
          onChange={handleChange}
        />

        <select name="riskLevel" value={filters.riskLevel} onChange={handleChange}>
          <option value="">All Risk Levels</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW_MEDIUM">Low-Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select name="matchFound" value={filters.matchFound} onChange={handleChange}>
          <option value="">Match: Any</option>
          <option value="true">Match Found</option>
          <option value="false">No Match</option>
        </select>

        <input
          type="date"
          name="fromDate"
          value={filters.fromDate}
          onChange={handleChange}
        />

        <input
          type="date"
          name="toDate"
          value={filters.toDate}
          onChange={handleChange}
        />

        <button type="submit">Search</button>
        <button type="button" className="reset-btn" onClick={handleReset}>
          Reset
        </button>
      </form>

      {error && <div className="audit-error">{error}</div>}

      <div className="table-container">
        <div className="table-header-row">
          <h3>Audit Records</h3>
          <span>{totalRecords} total record{totalRecords === 1 ? "" : "s"}</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Document No.</th>
              <th>Match</th>
              <th>Score</th>
              <th>Risk Level</th>
              <th>Recommended Action</th>
              <th>Requested By</th>
              <th>Screened On</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="loading-row">
                  Loading audit logs...
                </td>
              </tr>
            )}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={9} className="loading-row">
                  No audit records found.
                </td>
              </tr>
            )}

            {!loading &&
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.requestName || "-"}</td>
                  <td>{item.requestDocumentNumber || "-"}</td>
                  <td>{item.matchFound ? "Yes" : "No"}</td>
                  <td>{item.highestScore ?? "-"}</td>
                  <td>
                    <span className={`risk-badge ${riskClass(item.riskLevel)}`}>
                      {item.riskLevel || "-"}
                    </span>
                  </td>
                  <td>{item.recommendedAction || "-"}</td>
                  <td>{item.requestedBy || "-"}</td>
                  <td>{formatDate(item.screenedOn)}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="pagination">
          <button disabled={pageNumber <= 1} onClick={() => goToPage(pageNumber - 1)}>
            Previous
          </button>

          <span>
            Page {pageNumber} of {totalPages}
          </span>

          <button disabled={pageNumber >= totalPages} onClick={() => goToPage(pageNumber + 1)}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}