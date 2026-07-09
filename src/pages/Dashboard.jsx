import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [riskBreakdown, setRiskBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [summaryRes, riskRes] = await Promise.all([
        api.get("/screening/dashboard/summary"),
        api.get("/screening/dashboard/risk-breakdown"),
      ]);

      if (summaryRes.data.success) {
        setSummary(summaryRes.data.data);
      } else {
        setError(summaryRes.data.message || "Failed to load dashboard summary.");
      }

      if (riskRes.data.success) {
        setRiskBreakdown(riskRes.data.data || []);
      } else {
        setError((prev) => prev || riskRes.data.message || "Failed to load risk breakdown.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Unable to reach the dashboard API. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  const riskLevelClass = (riskLevel) => {
    switch (riskLevel) {
      case "HIGH":
        return "high";
      case "LOW_MEDIUM":
        return "medium";
      case "NO_MATCH":
        return "low";
      default:
        return "";
    }
  };

  const riskLevelLabel = (riskLevel) => {
    switch (riskLevel) {
      case "HIGH":
        return "High Risk";
      case "LOW_MEDIUM":
        return "Low / Medium Risk";
      case "NO_MATCH":
        return "No Match";
      default:
        return riskLevel;
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="page-title">
          <h2>Dashboard</h2>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="page-title">
          <h2>Dashboard</h2>
        </div>
        <div className="error-message">{error}</div>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  const trend = summary?.last7DaysTrend || [];

  return (
    <div className="dashboard">
      <div className="page-title">
        <h2>Dashboard</h2>
        <p>Welcome to SEJAYA Micro Credit Ltd - Sanctions Screening System</p>
      </div>

      {/* Statistics */}

      <div className="cards">
        <div className="card">
          <h3>Total Screenings</h3>
          <h1>{summary.totalScreeningsToday.toLocaleString()}</h1>
          <span>Today's Completed Screenings</span>
        </div>

        <div className="card">
          <h3>High Risk</h3>
          <h1>{summary.highRiskCountToday.toLocaleString()}</h1>
          <span>Requires Immediate Review</span>
        </div>

        <div className="card">
          <h3>Medium Risk</h3>
          <h1>{summary.mediumRiskCountToday.toLocaleString()}</h1>
          <span>Pending Verification</span>
        </div>

        <div className="card">
          <h3>Low Risk</h3>
          <h1>{summary.lowRiskCountToday.toLocaleString()}</h1>
          <span>Successfully Cleared</span>
        </div>
      </div>

      {/* Risk Breakdown */}

      <div className="table-card">
        <h3>Risk Breakdown</h3>

        {riskBreakdown.length === 0 ? (
          <p style={{ color: "#888" }}>No risk breakdown data available.</p>
        ) : (
          <div className="risk-breakdown">
            {riskBreakdown.map((item) => (
              <div className="risk-breakdown-row" key={item.riskLevel}>
                <div className="risk-breakdown-label">
                  <span className={`risk-dot ${riskLevelClass(item.riskLevel)}`}></span>
                  <span>{riskLevelLabel(item.riskLevel)}</span>
                </div>

                <div className="risk-breakdown-bar-track">
                  <div
                    className={`risk-breakdown-bar ${riskLevelClass(item.riskLevel)}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>

                <div className="risk-breakdown-values">
                  <strong>{item.count}</strong>
                  <span>{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7-Day Trend */}

      <div className="table-card">
        <h3>Last 7 Days Screening Trend</h3>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Total Screenings</th>
              <th>Matches</th>
              <th>High Risk</th>
              <th>Medium Risk</th>
              <th>Low Risk</th>
              <th>No Match</th>
            </tr>
          </thead>

          <tbody>
            {trend.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No trend data available.
                </td>
              </tr>
            )}

            {trend.map((day, index) => (
              <tr key={index}>
                <td>{formatDate(day.screeningDate)}</td>
                <td>{day.totalScreenings}</td>
                <td>{day.matchCount}</td>
                <td>
                  <span className="high">{day.highRiskCount}</span>
                </td>
                <td>
                  <span className="medium">{day.mediumRiskCount}</span>
                </td>
                <td>
                  <span className="low">{day.lowRiskCount}</span>
                </td>
                <td>{day.noMatchCount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="trend-summary">
          <span>
            <strong>{summary.totalScreeningsLast7Days}</strong> total screenings
          </span>
          <span>
            <strong>{summary.totalMatchesLast7Days}</strong> total matches
          </span>
        </div>
      </div>
    </div>
  );
}