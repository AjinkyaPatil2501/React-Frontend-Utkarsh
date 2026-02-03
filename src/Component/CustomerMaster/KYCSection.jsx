import { useState, useRef, useEffect } from "react";
import "../../ComponentCss/onboarding.css";
import { useTranslation } from "react-i18next";

const KYCSection = ({ data = [], onChange ,customerId}) => {
  const [entry, setEntry] = useState({
    name: "",
    number: "",
    image: null
  });

  const [editIndex, setEditIndex] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedDocImage, setSelectedDocImage] = useState(null); // ✅ For showing clicked document image
  
  // ✅ Camera refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  const { t } = useTranslation();

  const updateEntry = (field, value) => {
    const updated = { ...entry, [field]: value };
    setEntry(updated);
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const handleImage = async (file) => {
    if (!file) return;
    const base64 = await fileToBase64(file);
    setImagePreview(`data:image/jpeg;base64,${base64}`);
    updateEntry("image", base64);
  };

  // ✅ CAMERA FUNCTIONS
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Use back camera for documents
      });
      streamRef.current = stream;
      setCameraOpen(true);
    } catch {
      alert("Camera access denied or not available");
    }
  };

  useEffect(() => {
    if (cameraOpen && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOpen]);

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "kyc-document.jpg", { type: "image/jpeg" });
      const base64 = await fileToBase64(file);
      setImagePreview(`data:image/jpeg;base64,${base64}`);
      updateEntry("image", base64);
    }, "image/jpeg");

    closeCamera();
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraOpen(false);
  };

  const addKyc = () => {
    if (!entry.name || !entry.number) {
      alert("Please fill document name and number");
      return;
    }

    let updatedList = [...data];

    if (editIndex !== null) {
      updatedList[editIndex] = entry; // UPDATE
    } else {
      updatedList.push(entry); // ADD
    }

    onChange(updatedList);

    // Reset form
    setEntry({ name: "", number: "", image: null });
    setImagePreview(null);
    setEditIndex(null);
  };

  // ✅ DELETE FUNCTION
  const deleteKyc = async (doc, index) => {
  if (!window.confirm("Are you sure you want to delete this document?")) return;

  try {
    const response = await fetch(
      `https://utkarsh-core-banking.onrender.com/customers/v1/kyc?customerId=${customerId}&docNumber=${encodeURIComponent(doc.number)}`,
      { method: "DELETE" }
    );

    if (!response.ok) {
      throw new Error("Failed to delete KYC");
    }

    // ✅ update UI ONLY after API success
    const updatedList = data.filter((_, i) => i !== index);
    onChange(updatedList);

    if (editIndex === index) {
      setEntry({ name: "", number: "", image: null });
      setImagePreview(null);
      setEditIndex(null);
    }

  } catch (error) {
    console.error("Delete failed:", error);
    alert("Unable to delete document. Please try again.");
  }
};
  // ✅ HANDLE ROW CLICK - Show document image
  const handleRowClick = (doc, index) => {
    setEntry({
      name: doc.name,
      number: doc.number,
      image: doc.image || null
    });
    setEditIndex(index);
    setImagePreview(doc.image ? `data:image/jpeg;base64,${doc.image}` : null);
    
    // ✅ Show the clicked document's image in a separate preview
    if (doc.image) {
      setSelectedDocImage(`data:image/jpeg;base64,${doc.image}`);
    }
  };

  return (
    <div className="section">
      <h3>{t("kycDocuments")}</h3>

      {/* INPUTS */}
      <label>
        {t("documentName")} :
        <input
          value={entry.name}
          onChange={(e) => updateEntry("name", e.target.value)}
        />
      </label>

      <label>
        {t("documentNumber")} :
        <input
          value={entry.number}
          onChange={(e) => updateEntry("number", e.target.value)}
        />
      </label>

      <label>
        {t("uploadImage")} :
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
        />
        <button type="button" onClick={openCamera}>{t("openCamera")}</button>
      </label>

      {/* IMAGE PREVIEW */}
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="KYC Document" style={{ maxWidth: "300px" }} />
        </div>
      )}

      <button type="button" onClick={addKyc}>
        {editIndex !== null ? t("update") : t("save")}
      </button>

      {/* ✅ CAMERA BOX */}
      {cameraOpen && (
        <div className="camera-box">
          <video ref={videoRef} autoPlay playsInline />
          <canvas ref={canvasRef} hidden />
          <div className="camera-buttons">
            <button type="button" onClick={captureImage}>{t("capture")}</button>
            <button type="button" onClick={closeCamera}>{t("cancel")}</button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <table className="kyc-table">
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("number")}</th>
            <th>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((doc, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: editIndex === i ? "#eef" : "transparent"
              }}
            >
              <td 
                onClick={() => handleRowClick(doc, i)}
                style={{ cursor: "pointer" }}
              >
                {doc.name}
              </td>
              <td 
                onClick={() => handleRowClick(doc, i)}
                style={{ cursor: "pointer" }}
              >
                {doc.number}
              </td>
              <td>
                <button 
                  type="button" 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteKyc(doc,i);
                  }}
                  style={{
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  {t("delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ SHOW CLICKED DOCUMENT IMAGE */}
      {/* {selectedDocImage && (
        <div className="selected-doc-preview" style={{ marginTop: "20px" }}>
          <h4>{t("documentImage")}</h4>
          <img 
            src={selectedDocImage} 
            alt="Selected Document" 
            style={{ 
              maxWidth: "500px", 
              border: "1px solid #ccc", 
              borderRadius: "4px" 
            }} 
          />
          <button 
            type="button" 
            onClick={() => setSelectedDocImage(null)}
            style={{ display: "block", marginTop: "10px" }}
          >
            {t("close")}
          </button>
        </div>
      )} */}
    </div>
  );
};

export default KYCSection;