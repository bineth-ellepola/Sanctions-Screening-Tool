import { useEffect, useState, useCallback } from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import api from "../services/api";
import "../styles/HighRisk.css";

const initialFilters = {
  requestName: "",
  documentNumber: "",
  riskLevel: "",
  matchFound: "",
  fromDate: "",
  toDate: "",
};

const riskLevelInfo = [
  {
    level: "HIGH",
    className: "high",
    meaning: "Strong match found. Very likely the same person/entity as a listed sanctions subject.",
    action: "Block & Escalate",
    actionDetail: "Stop onboarding immediately and escalate to compliance.",
  },
  {
    level: "MEDIUM",
    className: "medium",
    meaning: "Possible match. Some identifying details align but it isn't a strong or confirmed match.",
    action: "Escalate for Review",
    actionDetail: "Send to compliance for further review before proceeding.",
  },
  {
    level: "LOW_MEDIUM",
    className: "low-medium",
    meaning: "Weak match. Limited overlap in name/document details with a listed subject.",
    action: "Manual Review",
    actionDetail: "A staff member should manually check the details before deciding.",
  },
  {
    level: "LOW",
    className: "low",
    meaning: "No significant match, or only a low-confidence match was found.",
    action: "Proceed (with caution)",
    actionDetail: "Onboarding/processing can continue, taking note of the caution flag if shown.",
  },
];

export default function HighRisk() {
  const [filters, setFilters] = useState(initialFilters);
  const [items, setItems] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRiskInfo, setShowRiskInfo] = useState(false);

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

  const fetchLogs = useCallback(async (page = 1) => {
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
      setError("Failed to load screening records. Please try again.");
      setItems([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pageSize]);

  useEffect(() => {
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs(1);
  };

  const handleReset = () => {
    setFilters(initialFilters);
    setTimeout(() => fetchLogs(1), 0);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchLogs(page);
  };

  const formatDate = (value) => {
    if (!value) return "-";
    return new Date(value).toLocaleString();
  };

  const riskClass = (risk) => {
    if (!risk) return "";
    return risk.toLowerCase().replace("_", "-");
  };

  return (
    <div className="highrisk-page">

      <div className="title-area">
        <div className="title-row">
          <h2>Risk Screening Records</h2>
          <button
            type="button"
            className="info-btn"
            onClick={() => setShowRiskInfo(true)}
            title="What do the risk levels mean?"
            aria-label="Risk level information"
          >
            <FaInfoCircle />
          </button>
        </div>
        <p>Complete audit log of screened customers, filterable by risk level, match status, and date.</p>
      </div>

      {showRiskInfo && (
        <div className="risk-info-overlay" onClick={() => setShowRiskInfo(false)}>
          <div className="risk-info-card" onClick={(e) => e.stopPropagation()}>
            <div className="risk-info-header">
              <h3>Understanding Risk Levels</h3>
              <button
                type="button"
                className="risk-info-close"
                onClick={() => setShowRiskInfo(false)}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>

            <p className="risk-info-intro">
              Each screened record is assigned a risk level based on how closely it matches
              an entry on a sanctions list. Here's what each level means and what action is recommended.
            </p>

            <div className="risk-info-list">
              {riskLevelInfo.map((r) => (
                <div className="risk-info-row" key={r.level}>
                  <span className={`risk-badge ${r.className}`}>{r.level.replace("_", "-")}</span>
                  <div className="risk-info-text">
                    <p className="risk-info-meaning">{r.meaning}</p>
                    <p className="risk-info-action">
                      <strong>Recommended action:</strong> {r.action} — {r.actionDetail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <form className="highrisk-filters" onSubmit={handleSearch}>
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
          <h3>Screening Records</h3>
          <span>{totalRecords} total record{totalRecords === 1 ? "" : "s"}</span>
        </div>

        <div className="table-scroll">
          <table>

            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Document Number</th>
                <th>Match Found</th>
                <th>Match Score</th>

                <th>Risk Level</th>


                <th>Requested By</th>

                <th>Screened On</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={12} className="loading-row">
                    Loading records...
                  </td>
                </tr>
              )}

              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={12} className="loading-row">
                    No records found.
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

                    <td>
                      <span className="risk-score">
                        {item.highestScore != null ? `${item.highestScore}%` : "-"}
                      </span>
                    </td>



                    <td>
                      <span className={`risk-badge ${riskClass(item.riskLevel)}`}>
                        {item.riskLevel || "-"}
                      </span>
                    </td>




                    <td>{item.requestedBy || "-"}</td>



                    <td>{formatDate(item.screenedOn)}</td>

                  </tr>
                ))}
            </tbody>

          </table>
        </div>

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