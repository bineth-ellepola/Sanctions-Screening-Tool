import { useState } from "react";
import api from "../services/api";
import "../styles/XmlUpload.css";

export default function ExcelUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileCategory, setFileCategory] = useState(null); // "entities" | "individuals" | null
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [error, setError] = useState("");

  const [importingXml, setImportingXml] = useState(false);
  const [xmlImportStatus, setXmlImportStatus] = useState("");
  const [xmlImportError, setXmlImportError] = useState("");

  const detectFileCategory = (fileName) => {
    const name = fileName.toLowerCase();
    if (name.includes("entities")) return "entities";
    if (name.includes("individuals")) return "individuals";
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setUploadStatus("");
    setError("");

    if (file) {
      const category = detectFileCategory(file.name);
      setFileCategory(category);

      if (!category) {
        setError(
          "Could not determine file type from the file name. The file name must contain either \"Entities\" or \"Individuals\" (e.g. 2026_01_06_Entities.xlsx)."
        );
      }
    } else {
      setFileCategory(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an Excel file.");
      return;
    }

    const allowedExtensions = [".xlsx", ".xls"];
    const fileName = selectedFile.name.toLowerCase();
    const isValidExtension = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    if (!isValidExtension) {
      setError("Please select a valid Excel file (.xlsx or .xls).");
      return;
    }

    const category = detectFileCategory(selectedFile.name);

    if (!category) {
      setError(
        "Could not determine file type from the file name. The file name must contain either \"Entities\" or \"Individuals\" (e.g. 2026_01_06_Entities.xlsx)."
      );
      return;
    }

    setUploading(true);
    setUploadStatus("");
    setError("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    const endpoint =
      category === "entities"
        ? "/import/excel/entities"
        : "/import/excel/individuals";

    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadStatus(
          response.data.message ||
            `Excel file (${category}) uploaded successfully.`
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
          Select the latest sanctions Excel file (Entities or Individuals)
          and upload it to the system. The file type is detected
          automatically from the file name.
        </p>

        <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />

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

            <p>
              <strong>Detected Category:</strong>{" "}
              {fileCategory ? (
                <span className={`category-tag ${fileCategory}`}>
                  {fileCategory === "entities" ? "Entities" : "Individuals"}
                </span>
              ) : (
                <span className="category-tag unknown">Unknown</span>
              )}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !fileCategory}
        >
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