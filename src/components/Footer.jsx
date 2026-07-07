import "../styles/Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div>
          <strong>SEJAYA Micro Credit Ltd</strong>
          <p>Sanctions screening and compliance monitoring for internal operations.</p>
        </div>

        <div className="app-footer__meta">
          <span>Version 1.0</span>
          <span>© {year} All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}