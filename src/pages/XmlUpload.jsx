import { useState } from "react";
import "../styles/XmlUpload.css";

export default function XmlUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus("");
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select an Excel file.");
      return;
    }

    // Replace this with your .NET API call later
    setUploadStatus("Excel file uploaded successfully.");
  };

  return (
    <div className="xml-page">

        <h2>Excel Upload</h2>

        <div className="xml-card">

          <h3>Upload Latest Sanctions Excel File</h3>

          <p>
            Select the latest sanctions Excel file and upload it to the system.
          </p>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <div className="file-details">

              <h4>Selected File</h4>

              <p><strong>Name:</strong> {selectedFile.name}</p>

              <p>
                <strong>Size:</strong>{" "}
                {(selectedFile.size / 1024).toFixed(2)} KB
              </p>

              <p><strong>Type:</strong> {selectedFile.type}</p>

            </div>
          )}

          <button onClick={handleUpload}>
            Upload Excel
          </button>

          {uploadStatus && (
            <div className="success-message">
              {uploadStatus}
            </div>
          )}

        </div>

      </div>
  );
}