import { useState } from "react";
import api from "../services/api";
import "../styles/XmlUpload.css";

export default function ExcelUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");

  const [importingXml, setImportingXml] = useState(false);
  const [xmlImportStatus, setXmlImportStatus] = useState("");
  const [xmlImportError, setXmlImportError] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadStatus("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an Excel file.");
      return;
    }

    const allowedExtensions = [".xlsx", ".xls"];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isValid) {
      setError("Please select a valid Excel file (.xlsx or .xls).");
      return;
    }

    setUploading(true);
    setUploadStatus("");
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await api.post("/import/excel/individuals", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadStatus(
          response.data.message || "Excel file uploaded successfully."
        );
      } else {
        setError(response.data.message || "Excel upload failed.");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        setError(
          "Upload endpoint not found (404). Please confirm the correct import route with the backend team."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to upload the file. Please try again."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleImportXml = async () => {
    setImportingXml(true);
    setXmlImportStatus("");
    setXmlImportError("");

    try {
      const response = await api.post("/import/download");

      if (response.data.success) {
        setXmlImportStatus(
          response.data.message || "XML import triggered successfully."
        );
      } else {
        setXmlImportError(response.data.message || "XML import failed.");
      }
    } catch (err) {
      console.error(err);
      setXmlImportError(
        err.response?.data?.message ||
          "Unable to trigger XML import. Please try again."
      );
    } finally {
      setImportingXml(false);
    }
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

            <p>
              <strong>Name:</strong> {selectedFile.name}
            </p>

            <p>
              <strong>Size:</strong>{" "}
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>

            <p>
              <strong>Type:</strong> {selectedFile.type || "N/A"}
            </p>
          </div>
        )}

        <button onClick={handleUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Excel"}
        </button>

        {error && <div className="error-message">{error}</div>}

        {uploadStatus && <div className="success-message">{uploadStatus}</div>}
      </div>

      <div className="xml-card">
        <h3>Import XML from Configured URLs</h3>

        <p>
          Trigger an import of the latest sanctions list from the configured
          XML source URLs.
        </p>

        <button onClick={handleImportXml} disabled={importingXml}>
          {importingXml ? "Importing..." : "Import XML"}
        </button>

        {xmlImportError && <div className="error-message">{xmlImportError}</div>}

        {xmlImportStatus && (
          <div className="success-message">{xmlImportStatus}</div>
        )}
      </div>
    </div>
  );
}