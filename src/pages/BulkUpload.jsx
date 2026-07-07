import { useState } from "react";
import "../styles/BulkUpload.css";

export default function BulkUpload() {

  const [file, setFile] = useState(null);

  const handleUpload = () => {

    if (!file) {

      alert("Please select a CSV or Excel file.");

      return;

    }

    alert(`Selected File: ${file.name}`);

    // Connect to .NET API later

  };

  return (
    <div className="upload-page">

        <h2>Bulk Customer Upload</h2>

        <div className="upload-card">

          <input

            type="file"

            accept=".csv,.xlsx,.xls"

            onChange={(e)=>setFile(e.target.files[0])}

          />

          <button onClick={handleUpload}>

            Upload File

          </button>

        </div>

        {file && (

          <div className="selected-file">

            <h3>Selected File</h3>

            <p>{file.name}</p>

            <p>{(file.size/1024).toFixed(2)} KB</p>

          </div>

        )}

      </div>

  );

}