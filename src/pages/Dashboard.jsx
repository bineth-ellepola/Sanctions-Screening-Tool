import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  return (
    <>
      <Sidebar />
      <Header />

      <div className="dashboard">

        <div className="page-title">
          <h2>Dashboard</h2>
          <p>Welcome to SEJAYA Micro Credit Ltd - Sanctions Screening System</p>
        </div>

        {/* Statistics */}

        <div className="cards">

          <div className="card">
            <h3>Total Screenings</h3>
            <h1>1,250</h1>
            <span>Today's Completed Screenings</span>
          </div>

          <div className="card">
            <h3>High Risk</h3>
            <h1>8</h1>
            <span>Requires Immediate Review</span>
          </div>

          <div className="card">
            <h3>Medium Risk</h3>
            <h1>25</h1>
            <span>Pending Verification</span>
          </div>

          <div className="card">
            <h3>Low Risk</h3>
            <h1>1217</h1>
            <span>Successfully Cleared</span>
          </div>

        </div>

        {/* Recent Screenings */}

        <div className="table-card">

          <h3>Recent Screening Results</h3>

          <table>

            <thead>

              <tr>

                <th>Customer Name</th>

                <th>NIC</th>

                <th>Risk Level</th>

                <th>Status</th>

                <th>Date</th>

              </tr>

            </thead>

            <tbody>

              <tr>

                <td>Kasun Perera</td>

                <td>980456789V</td>

                <td>
                  <span className="low">Low</span>
                </td>

                <td>Completed</td>

                <td>30/06/2026</td>

              </tr>

              <tr>

                <td>Nimal Silva</td>

                <td>911223456V</td>

                <td>
                  <span className="high">High</span>
                </td>

                <td>Completed</td>

                <td>30/06/2026</td>

              </tr>

              <tr>

                <td>Amali Fernando</td>

                <td>887654321V</td>

                <td>
                  <span className="medium">Medium</span>
                </td>

                <td>Completed</td>

                <td>30/06/2026</td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}