import {
  FaHome,
  FaSearch,
  FaFileExcel,
  FaFileUpload,
  FaChartBar,
  FaUsers,
  FaCog,
  FaExclamationTriangle,
  FaSignOutAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "../styles/Sidebar.css";

export default function Sidebar() {

  return (

    <div className="sidebar">

      <div className="sidebar-logo">

        <h2>SEJAYA</h2>

        <span>Micro Credit Ltd</span>

      </div>

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

            High Risk

          </NavLink>

        </li>

        <li>

          <NavLink to="/reports" className="nav-link">

            <FaChartBar />

            Reports

          </NavLink>

        </li>

        <li>

          <NavLink to="/users" className="nav-link">

            <FaUsers />

            Users

          </NavLink>

        </li>

        <li>

          <NavLink to="/settings" className="nav-link">

            <FaCog />

            Settings

          </NavLink>

        </li>

      </ul>

      <div className="logout">

        <FaSignOutAlt />

        Logout

      </div>

    </div>

  );

}