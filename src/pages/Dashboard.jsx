import { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/screening/dashboard/summary");

      if (response.data.success) {
        setSummary(response.data.data);
      } else {
        setError(response.data.message || "Failed to load dashboard summary.");
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
        <button onClick={fetchSummary}>Retry</button>
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