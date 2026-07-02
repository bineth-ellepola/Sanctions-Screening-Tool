import "../styles/Header.css";

export default function Header() {

  return (

    <div className="header">

      <div>

        <h2>Sanctions Screening System</h2>

        <span>SEJAYA Micro Credit Ltd</span>

      </div>

      <div className="header-right">

        <div className="notification">

          🔔

        </div>

        <div className="profile">

          <div className="avatar">

            A

          </div>

          <div>

            <strong>Administrator</strong>

            <p>Admin</p>

          </div>

        </div>

      </div>

    </div>

  );

}