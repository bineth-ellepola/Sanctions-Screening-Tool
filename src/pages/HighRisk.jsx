import { useState } from "react";
import "../styles/HighRisk.css";

export default function HighRisk() {

  const [search, setSearch] = useState("");

  const customers = [
    {
      id: 1,
      name: "Nimal Silva",
      nic: "920654321V",
      matched: "UN Sanctions List",
      score: "98%",
      officer: "Kasun",
      status: "Blocked"
    },
    {
      id: 2,
      name: "John Fernando",
      nic: "881234567V",
      matched: "Local Sanctions List",
      score: "95%",
      officer: "Amali",
      status: "Blocked"
    },
    {
      id: 3,
      name: "Mohamed Ali",
      nic: "900987654V",
      matched: "UN Sanctions List",
      score: "99%",
      officer: "Nuwan",
      status: "Blocked"
    }
  ];

  const filtered = customers.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.nic.includes(search)
  );

  return (
    <div className="highrisk-page">

        <div className="title-area">

          <h2>High Risk Customers</h2>

          <p>
            Customers requiring immediate compliance review.
          </p>

        </div>

        <div className="search-box">

          <input
            type="text"
            placeholder="Search Customer Name or NIC..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>

                <th>Customer</th>

                <th>NIC</th>

                <th>Matched List</th>

                <th>Risk Score</th>

                <th>Compliance Officer</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map((item) => (

                <tr key={item.id}>

                  <td>{item.name}</td>

                  <td>{item.nic}</td>

                  <td>{item.matched}</td>

                  <td>

                    <span className="risk-score">

                      {item.score}

                    </span>

                  </td>

                  <td>{item.officer}</td>

                  <td>

                    <span className="status">

                      {item.status}

                    </span>

                  </td>

                  <td>

                    <button className="view-btn">

                      View

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
  );

}