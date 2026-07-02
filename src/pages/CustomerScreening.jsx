import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/CustomerScreening.css";

export default function CustomerScreening() {
  const [form, setForm] = useState({
    name: "",
    nic: "",
    passport: "",
    dob: "",
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    // Replace this with .NET API call later
    setResults([
      {
        id: 1,
        name: "Kasun Perera",
        nic: "980123456V",
        risk: "Low",
        status: "No Match",
      },
      {
        id: 2,
        name: "Nimal Silva",
        nic: "920654321V",
        risk: "High",
        status: "Potential Match",
      },
    ]);
  };

  return (
    <>
      <Sidebar />
      <Header />

      <div className="screening-page">

        <h2>Customer Screening</h2>

        <div className="screening-form">

          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="nic"
            placeholder="NIC"
            value={form.nic}
            onChange={handleChange}
          />

          <input
            type="text"
            name="passport"
            placeholder="Passport"
            value={form.passport}
            onChange={handleChange}
          />

          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <button onClick={handleSearch}>
            Search
          </button>

        </div>

        <div className="result-table">

          <table>

            <thead>

              <tr>

                <th>Name</th>

                <th>NIC</th>

                <th>Risk</th>

                <th>Status</th>

              </tr>

            </thead>

            <tbody>

              {results.map((item) => (

                <tr key={item.id}>

                  <td>{item.name}</td>

                  <td>{item.nic}</td>

                  <td className={item.risk.toLowerCase()}>
                    {item.risk}
                  </td>

                  <td>{item.status}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </>
  );
}