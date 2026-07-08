import "../styles/SubjectDetailsModal.css";

export default function SubjectDetailsModal({ subject, loading, error, onClose }) {
  if (!loading && !error && !subject) return null;

  const formatDate = (isoDate) => {
    if (!isoDate) return "-";
    return new Date(isoDate).toLocaleDateString("en-GB");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Subject Details</h3>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {loading && <p className="modal-loading">Loading subject details...</p>}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && subject && (
            <>
              <section className="modal-section">
                <h4>Basic Information</h4>
                <div className="modal-grid">
                  <div>
                    <span className="label">Full Name</span>
                    <span className="value">{subject.fullName || "-"}</span>
                  </div>
                  <div>
                    <span className="label">Subject Type</span>
                    <span className="value">{subject.subjectType || "-"}</span>
                  </div>
                  <div>
                    <span className="label">Reference Number</span>
                    <span className="value">{subject.referenceNumber || "-"}</span>
                  </div>
                  <div>
                    <span className="label">List Type</span>
                    <span className="value">{subject.listType || "-"}</span>
                  </div>
                  <div>
                    <span className="label">Listed On</span>
                    <span className="value">{formatDate(subject.listedOn)}</span>
                  </div>
                  <div>
                    <span className="label">Data ID</span>
                    <span className="value">{subject.dataId || "-"}</span>
                  </div>
                </div>
              </section>

              {subject.comments && (
                <section className="modal-section">
                  <h4>Comments</h4>
                  <p className="modal-comments">{subject.comments}</p>
                </section>
              )}

              {subject.aliases?.length > 0 && (
                <section className="modal-section">
                  <h4>Aliases</h4>
                  <ul>
                    {subject.aliases.map((a, i) => (
                      <li key={i}>{a.aliasName || JSON.stringify(a)}</li>
                    ))}
                  </ul>
                </section>
              )}

              {subject.documents?.length > 0 && (
                <section className="modal-section">
                  <h4>Documents</h4>
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Number</th>
                        <th>Country of Issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subject.documents.map((d, i) => (
                        <tr key={i}>
                          <td>{d.documentType}</td>
                          <td>{d.documentNumber}</td>
                          <td>{d.countryOfIssue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              )}

              {subject.nationalities?.length > 0 && (
                <section className="modal-section">
                  <h4>Nationalities</h4>
                  <ul>
                    {subject.nationalities.map((n, i) => (
                      <li key={i}>{n.nationality}</li>
                    ))}
                  </ul>
                </section>
              )}

              {subject.datesOfBirth?.length > 0 && (
                <section className="modal-section">
                  <h4>Dates of Birth</h4>
                  <ul>
                    {subject.datesOfBirth.map((d, i) => (
                      <li key={i}>
                        {d.typeOfDate}: {d.dateValue ? formatDate(d.dateValue) : d.note}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {subject.placesOfBirth?.length > 0 && (
                <section className="modal-section">
                  <h4>Places of Birth</h4>
                  <ul>
                    {subject.placesOfBirth.map((p, i) => (
                      <li key={i}>
                        {[p.city, p.stateProvince, p.country].filter(Boolean).join(", ")}
                        {p.note ? ` (${p.note})` : ""}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {subject.addresses?.length > 0 && (
                <section className="modal-section">
                  <h4>Addresses</h4>
                  <ul>
                    {subject.addresses.map((a, i) => (
                      <li key={i}>
                        {a.country ? `${a.country} - ` : ""}
                        {a.note}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {subject.designations?.length > 0 && (
                <section className="modal-section">
                  <h4>Designations</h4>
                  <ul>
                    {subject.designations.map((d, i) => (
                      <li key={i}>{d.designation || JSON.stringify(d)}</li>
                    ))}
                  </ul>
                </section>
              )}

              {subject.lastDayUpdated?.length > 0 && (
                <section className="modal-section">
                  <h4>Last Updated</h4>
                  <ul>
                    {subject.lastDayUpdated.map((u, i) => (
                      <li key={i}>{formatDate(u.updatedDate)}</li>
                    ))}
                  </ul>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}