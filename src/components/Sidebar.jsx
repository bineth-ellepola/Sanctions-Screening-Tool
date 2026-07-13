import {
  FaHome,
  FaSearch,
  FaFileExcel,
  FaFileUpload,
  FaChartBar,
  FaUsers,
  FaCog,
  FaExclamationTriangle,
  FaClipboardList,
  FaSignOutAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import logo from "../assets/logo.jpg";

import "../styles/Sidebar.css";

export default function Sidebar() {

  return (

    <div className="sidebar">

      {/* Logo */}

      <div className="sidebar-logo">

        <img
          src={logo}
          alt="SEJAYA Logo"
          className="company-logo"
        />

        <h2>SEJAYA</h2>

        <span>Micro Credit Ltd</span>

      </div>

      {/* Menu */}

      <ul>

        <li>
          <NavLink to="/dashboard" className="nav-link">
            <FaHome />
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/screening" className="nav-link">
            <FaSearch />
            Customer Screening
          </NavLink>
        </li>

        <li>
          <NavLink to="/bulk-upload" className="nav-link">
            <FaFileExcel />
            Bulk Upload
          </NavLink>
        </li>

        <li>
          <NavLink to="/xml-upload" className="nav-link">
            <FaFileUpload />
            XML Upload
          </NavLink>
        </li>

        <li>
          <NavLink to="/high-risk" className="nav-link">
            <FaExclamationTriangle />
            Risk Screening Records
          </NavLink>
        </li>

        <li>
          <NavLink to="/audit-log" className="nav-link">
            <FaClipboardList />
            Audit Log
          </NavLink>
        </li>

      </ul>

      {/* Logout */}

      <div className="logout">

        <FaSignOutAlt />

        Logout

      </div>

    </div>

  );

}