import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [pdfLoading, setPdfLoading] = useState(false);

  const buildPayload = (page, size) => ({
    requestName: filters.requestName || "",
    documentNumber: filters.documentNumber || "",
    riskLevel: filters.riskLevel || "",
    matchFound: filters.matchFound === "" ? null : filters.matchFound === "true",
    fromDate: filters.fromDate ? new Date(filters.fromDate).toISOString() : null,
    toDate: filters.toDate ? new Date(filters.toDate).toISOString() : null,
    pageNumber: page,
    pageSize: size,
  });

  const fetchAuditLogs = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/screening/audit/search", buildPayload(page, pageSize));
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

  // Fetches every matching record (across all pages) using the current filters,
  // then builds the PDF from the complete result set.
  const fetchAllMatchingRecords = async () => {
    // First call to find out how many total records exist
    const firstResponse = await api.post(
      "/screening/audit/search",
      buildPayload(1, 1)
    );
    const total = firstResponse.data?.data?.totalRecords || 0;

    if (total === 0) return [];

    // Second call requesting all records in a single page
    const fullResponse = await api.post(
      "/screening/audit/search",
      buildPayload(1, total)
    );

    return fullResponse.data?.data?.items || [];
  };

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    setError("");

    try {
      const allItems = await fetchAllMatchingRecords();

      if (allItems.length === 0) {
        setError("No records available to export.");
        return;
      }

      const doc = new jsPDF({ orientation: "landscape" });

      doc.setFontSize(14);
      doc.setTextColor(215, 25, 69);
      doc.text("SEJAYA Micro Credit Ltd - Screening Audit Log", 14, 15);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}   |   Total Records: ${allItems.length}`,
        14,
        22
      );

      // Show applied filters, if any, under the header
      const activeFilters = [];
      if (filters.requestName) activeFilters.push(`Name: ${filters.requestName}`);
      if (filters.documentNumber) activeFilters.push(`Document: ${filters.documentNumber}`);
      if (filters.riskLevel) activeFilters.push(`Risk: ${filters.riskLevel}`);
      if (filters.matchFound) activeFilters.push(`Match: ${filters.matchFound === "true" ? "Yes" : "No"}`);
      if (filters.fromDate) activeFilters.push(`From: ${filters.fromDate}`);
      if (filters.toDate) activeFilters.push(`To: ${filters.toDate}`);

      let startY = 28;
      if (activeFilters.length > 0) {
        doc.setFontSize(9);
        doc.text(`Filters: ${activeFilters.join(" | ")}`, 14, 28);
        startY = 34;
      }

      autoTable(doc, {
        startY,
        head: [[
          "ID",
          "Customer Name",
          "Document No.",
          "Match",
          "Score",
          "Risk Level",
          "Recommended Action",
          "Requested By",
          "Request IP",
          "Screened On",
        ]],
        body: allItems.map((item) => [
          item.id,
          item.requestName || "-",
          item.requestDocumentNumber || "-",
          item.matchFound ? "Yes" : "No",
          item.highestScore ?? "-",
          item.riskLevel || "-",
          item.recommendedAction || "-",
          item.requestedBy || "-",
          item.requestIp || "-",
          formatDate(item.screenedOn),
        ]),
        headStyles: { fillColor: [215, 25, 69], textColor: 255 },
        styles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        didDrawPage: (data) => {
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text(
            `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
            data.settings.margin.left,
            doc.internal.pageSize.getHeight() - 8
          );
        },
      });

      doc.save(`audit-log-full-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error(err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="audit-page">
      <div className="title-area">
        <h2>Screening Audit Log</h2>
        <p>Search and review historical customer screening requests.</p>
      </div>

        <form className="filter-form" onSubmit={handleSearch}>
      </form>

      {error && <div className="audit-error">{error}</div>}

      <div className="table-container">
        <div className="table-header-row">
          <h3>Audit Records</h3>
          <div className="table-header-actions">
            <span>{totalRecords} total record{totalRecords === 1 ? "" : "s"}</span>
            <button
              className="pdf-btn"
              onClick={handleDownloadPdf}
              disabled={pdfLoading || totalRecords === 0}
            >
              {pdfLoading ? "Preparing PDF..." : "Download PDF"}
            </button>
          </div>
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