import { useState, useRef, useEffect } from "react";
import { allowNumberOnly, allowTextOnly } from "../../validation/validator";
import { useTranslation } from "react-i18next";
import "../../ComponentCss/CustomerMasterSection.css";

const CustomerMasterSection = ({ data = {}, onChange, errors = {}, touched = {}, firstNameRef ,personalDetails = {}}) => {
  const [photoPreview, setPhotoPreview] = useState(
    data.photo ? `data:image/jpeg;base64,${data.photo}` : null
  );
  const [signaturePreview, setSignaturePreview] = useState(
    data.signature ? `data:image/jpeg;base64,${data.signature}` : null
  );

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  // ✅ NEW: Separate refs for signature camera
  const signatureVideoRef = useRef(null);
  const signatureCanvasRef = useRef(null);
  const signatureStreamRef = useRef(null);
  const [signatureCameraOpen, setSignatureCameraOpen] = useState(false);
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  const safe = {
    name: {
      first: data.name?.first || "",
      middle: data.name?.middle || "",
      last: data.name?.last || ""
    },
    fatherHusbandName: data.fatherHusbandName || "",
    gender: data.gender || "",
    dob: data.dob || "",
    minor: data.minor || "",
    parentName: data.parentName || "",
    address: data.address || "",
    phone: data.phone || "",
    email: data.email || "",
    homeType: data.homeType || "",
    pan: data.pan || "",
    gst: data.gst || "",
    aadhaar: data.aadhaar || "",
    email1: data.email1 || "",
    email2: data.email2 || "",
    introducerId: data.introducerId || "",
    education: data.education || "",
    maritalStatus: data.maritalStatus || "",
    religion: data.religion || "",
    caste: data.caste || "",
    subCaste: data.subCaste || "",
    bloodGroup: data.bloodGroup || "",
    photo: data.photo || null,
    signature: data.signature || null
  };

  const isMinor = safe.minor === "Yes";

  const validateAndUpdate = (updated) => {
    onChange(updated);
  };

  const update = (field, value) => {
    validateAndUpdate({ ...safe, [field]: value });
  };

  const updateState = (updated) => {
    onChange(updated);
  };

  const updateName = (part, value) => {
    validateAndUpdate({
      ...safe,
      name: { ...safe.name, [part]: value }
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleDOBChange = (dob) => {
    const age = calculateAge(dob);
    validateAndUpdate({
      ...safe,
      dob,
      minor: age < 18 ? "Yes" : "No"
    });
  };

  useEffect(() => {
    if (!isMinor) {
      onChange({
        ...safe,
        parentName: "",
        address: "",
        phone: "",
        email: ""
      });
    }

  }, [isMinor]);

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const handlePhotoFile = async (file) => {
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    const base64 = await fileToBase64(file);
    validateAndUpdate({ ...safe, photo: base64 });
  };

  const handleFileChange = async (field, file) => {
    if (!file) return;
    const base64 = await fileToBase64(file);
    updateState({ ...safe, [field]: base64 });
    if (field === "signature") {
      setSignaturePreview(`data:image/jpeg;base64,${base64}`);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    validateAndUpdate({ ...safe, photo: null });
  };

  const removeSignature = () => {
    setSignaturePreview(null);
    updateState({ ...safe, signature: null });
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
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
  // console.log("want the eroors",errors)
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      if (!blob) return;
      handlePhotoFile(new File([blob], "photo.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");

    closeCamera();
  };

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setCameraOpen(false);
  };

  // ✅ NEW: SIGNATURE CAMERA FUNCTIONS
  const openSignatureCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      signatureStreamRef.current = stream;
      setSignatureCameraOpen(true);
    } catch {
      alert("Camera access denied or not available");
    }
  };

  useEffect(() => {
    if (signatureCameraOpen && signatureVideoRef.current) {
      signatureVideoRef.current.srcObject = signatureStreamRef.current;
    }
  }, [signatureCameraOpen]);

  const captureSignature = () => {
    const canvas = signatureCanvasRef.current;
    const video = signatureVideoRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], "signature.jpg", { type: "image/jpeg" });
      const base64 = await fileToBase64(file);
      setSignaturePreview(`data:image/jpeg;base64,${base64}`);
      updateState({ ...safe, signature: base64 });
    }, "image/jpeg");

    closeSignatureCamera();
  };

  const closeSignatureCamera = () => {
    signatureStreamRef.current?.getTracks().forEach((t) => t.stop());
    setSignatureCameraOpen(false);
  };

  const shouldShowError = (field, nestedField = null) => {
    if (nestedField) {
      return touched?.[field]?.[nestedField] && errors?.[field]?.[nestedField];
    }
    return touched?.[field] && errors?.[field];
  };

  return (
    <div className="section compact-form">
      <h3>{t("personalInformation")}</h3>

      {/* NAME */}
      <div className="grid grid-3">
        <label>
          <span> {t("firstName")} <span className="required">*</span></span>
          <input
            value={safe.name.first}
            onChange={e => updateName("first", e.target.value)}
            className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("name", "first") ? "input-error" : ""}`}
            onKeyDown={(e) => allowTextOnly(e, isMarathi)}
            ref={firstNameRef}
          />
          {shouldShowError("name", "first") && <span className="error-text">{errors.name.first}</span>}
        </label>

        <label>
          <span> {t("middleName")} <span className="required">*</span></span>
          <input
            value={safe.name.middle}
            onChange={e => updateName("middle", e.target.value)}
            className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("name", "middle") ? "input-error" : ""}`}
            onKeyDown={(e) => allowTextOnly(e, isMarathi)}
          />
          {shouldShowError("name", "middle") && <span className="error-text">{errors.name.middle}</span>}
        </label>

        <label>
          <span> {t("lastName")} <span className="required">*</span></span>
          <input
            value={safe.name.last}
            onChange={e => updateName("last", e.target.value)}
            className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("name", "last") ? "input-error" : ""}`}
            onKeyDown={(e) => allowTextOnly(e, isMarathi)}
          />
          {shouldShowError("name", "last") && <span className="error-text">{errors.name.last}</span>}
        </label>
      </div>

      <label>
        <span> {t("fatherHusbandName")} <span className="required">*</span></span>
        <input
          value={safe.fatherHusbandName}
          onChange={e => update("fatherHusbandName", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("fatherHusbandName") ? "input-error" : ""}`}
          onKeyDown={(e) => allowTextOnly(e, isMarathi)}
        />
        {shouldShowError("fatherHusbandName") && <span className="error-text">{errors.fatherHusbandName}</span>}
      </label>

      <div className="grid grid-auto">
        <label>
          {t("gender")}
          <select
            value={safe.gender}
            onChange={e => update("gender", e.target.value)}
            className={shouldShowError("gender") ? "input-error" : ""}
          >
            <option value="">{t("select")}</option>
            <option>{t("male")}</option>
            <option>{t("female")}</option>
            <option>{t("other")}</option>
          </select>
          {shouldShowError("gender") && <span className="error-text">{errors.gender}</span>}
        </label>

        <label>
          <span> {t("dob")} <span className="required">*</span></span>
          <input
            type="date"
            value={safe.dob}
            onChange={e => handleDOBChange(e.target.value)}
            className={shouldShowError("dob") ? "input-error" : ""}
          />
          {shouldShowError("dob") && <span className="error-text">{errors.dob}</span>}
        </label>

        <label>
          {t("minor")}
          <input value={safe.minor} readOnly />
        </label>
      </div>

      <label>
        {t("parentName")}
        <input
          value={safe.parentName}
          disabled={!isMinor}
          onChange={e => update("parentName", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("parentName") ? "input-error" : ""}`}
          onKeyDown={(e) => allowTextOnly(e, isMarathi)}
        />
        {shouldShowError("parentName") && <span className="error-text">{errors.parentName}</span>}
      </label>

      <label>
        {t("address")}
        <textarea
          value={safe.address}
          disabled={!isMinor}
          onChange={e => update("address", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("address") ? "input-error" : ""}`}
        />
        {shouldShowError("address") && <span className="error-text">{errors.address}</span>}
      </label>

      <div className="grid grid-2">
        <label>
          {t("phone")}
          <input
            value={safe.phone}
            disabled={!isMinor}
            onChange={e => { if (e.target.value.length < 11) { update("phone", e.target.value) } }}
            className={shouldShowError("phone") ? "input-error" : ""}
            onKeyDown={e => allowNumberOnly(e)}
          />
          {shouldShowError("phone") && <span className="error-text">{errors.phone}</span>}
        </label>

        <label>
          {t("email")}
          <input
            type="email"
            value={safe.email}
            disabled={!isMinor}
            onChange={e => update("email", e.target.value)}
            className={shouldShowError("email") ? "input-error" : ""}
          />
          {shouldShowError("email") && <span className="error-text">{errors.email}</span>}
        </label>
      </div>

      <div className="grid grid-2">
        <label>
          {t("emailId1")}
          <input
            value={safe.email1}
            onChange={e => update("email1", e.target.value)}
            className={shouldShowError("email1") ? "input-error" : ""}
          />
          {shouldShowError("email1") && <span className="error-text">{errors.email1}</span>}
        </label>
        <label>
          {t("emailId2")}
          <input
            value={safe.email2}
            onChange={e => update("email2", e.target.value)}
            className={shouldShowError("email2") ? "input-error" : ""}
          />
          {shouldShowError("email2") && <span className="error-text">{errors.email2}</span>}
        </label>
      </div>

      <label>
        {t("homeType")}
        <select
          value={safe.homeType}
          onChange={e => update("homeType", e.target.value)}
          className={shouldShowError("homeType") ? "input-error" : ""}
        >
          <option value="">{t("select")}</option>
          <option>{t("owned")}</option>
          <option>{t("rented")}</option>
        </select>
        {shouldShowError("homeType") && <span className="error-text">{errors.homeType}</span>}
      </label>

      <div className="grid grid-3">
        <label>
          <span> {t("panNo")} <span className="required">*</span></span>
          <input
            value={safe.pan}
            onChange={e => { if (e.target.value.length < 11) { update("pan", e.target.value.toUpperCase()) } }}
            className={shouldShowError("pan") ? "input-error" : ""}
          />
          {shouldShowError("pan") && <span className="error-text">{errors.pan}</span>}
        </label>

        <label>
          {t("gstNo")}
          <input
            value={safe.gst}
            onChange={e => { if (e.target.value.length < 16) { update("gst", e.target.value) } }}
            className={shouldShowError("gst") ? "input-error" : ""}
          />
          {shouldShowError("gst") && <span className="error-text">{errors.gst}</span>}
        </label>

        <label>
          <span> {t("aadhaar")} <span className="required">*</span></span>
          <input
            value={safe.aadhaar}
            onChange={e => { if (e.target.value.length < 13) { update("aadhaar", e.target.value) } }}
            onKeyDown={e => allowNumberOnly(e)}
            className={shouldShowError("aadhaar") ? "input-error" : ""}
          />
          {shouldShowError("aadhaar") && <span className="error-text">{errors.aadhaar}</span>}
        </label>
      </div>

      <div className="grid grid-3">
        <label>
          {t("introducerId")}
          <input
            value={safe.introducerId}
            onChange={e => update("introducerId", e.target.value)}
            className={shouldShowError("introducerId") ? "input-error" : ""}
          />

          {shouldShowError("introducerId") && <span className="error-text">{errors.introducerId}</span>}
        </label>

        <label>
          {t("education")}
          <select
            value={safe.education}
            onChange={e => update("education", e.target.value)}
            className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("education") ? "input-error" : ""}`}
          >
            <option value="">{t("select")}</option>
            {personalDetails.educationList.map((edu) => (
              <option key={edu.ceducationId} value={edu.ceducationId}>
                {edu.ceducationName}
              </option>
            ))}
          </select>
          {shouldShowError("education") && (
            <span className="error-text">{errors.education}</span>
          )}
        </label>


        <label>
          {t("maritalStatus")}
          <select
            value={safe.maritalStatus}
            onChange={e => update("maritalStatus", e.target.value)}
            className={shouldShowError("maritalStatus") ? "input-error" : ""}
          >
            <option value="">{t("select")}</option>
            <option>{t("single")}</option>
            <option>{t("married")}</option>
            <option>{t("divorced")}</option>
          </select>
          {shouldShowError("maritalStatus") && <span className="error-text">{errors.maritalStatus}</span>}
        </label>
      </div>

      <div className="grid grid-4">
        <label>
          {t("religion")}
          <select
            value={safe.religion}
            onChange={e => update("religion", e.target.value)}
            className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("religion") ? "input-error" : ""}`}
          >
            <option value="">{t("select")}</option>
            {personalDetails.religionList.map((rel) => (
              <option key={rel.creligionId} value={rel.creligionId}>
                {rel.creligionName}
              </option>
            ))}
          </select>
          {shouldShowError("religion") && (
            <span className="error-text">{errors.religion}</span>
          )}
        </label>
        <label>
          {t("caste")}
          <select
            value={safe.caste}
            onChange={e => update("caste", e.target.value)}
            className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("caste") ? "input-error" : ""}`}
          >
            <option value="">{t("select")}</option>
            {personalDetails.castList.map((cast) => (
              <option key={cast.ccastCode} value={cast.ccastCode}>
                {cast.ccastName}
              </option>
            ))}
          </select>
          {shouldShowError("caste") && (
            <span className="error-text">{errors.caste}</span>
          )}
        </label>


        <label>
          {t("subCaste")}
          <input
            value={safe.subCaste}
            onChange={e => update("subCaste", e.target.value)}
            className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("subCaste") ? "input-error" : ""}`}
            onKeyDown={(e) => allowTextOnly(e, isMarathi)}
            
          />
          {shouldShowError("subCaste") && <span className="error-text">{errors.subCaste}</span>}
        </label>

        <label>
          {t("bloodGroup")}
          <select
            value={safe.bloodGroup}
            onChange={e => update("bloodGroup", e.target.value)}
            className={shouldShowError("bloodGroup") ? "input-error" : ""}
          >
            <option value="">{t("select")}</option>
            <option>A+</option><option>A-</option>
            <option>B+</option><option>B-</option>
            <option>O+</option><option>O-</option>
            <option>AB+</option><option>AB-</option>
          </select>
          {shouldShowError("bloodGroup") && <span className="error-text">{errors.bloodGroup}</span>}
        </label>
      </div>

      {/* PHOTO & SIGNATURE */}
      <div className="grid grid-2">
        <label>{t("uploadPhoto")}
          <input type="file" accept="image/*" onChange={e => handlePhotoFile(e.target.files[0])} />
          <button type="button" onClick={openCamera}>{t("openCamera")}</button>
        </label>

        <label>{t("uploadSignature")}
          <input type="file" accept="image/*" onChange={e => handleFileChange("signature", e.target.files[0])} />
          <button type="button" onClick={openSignatureCamera}>{t("openCamera")}</button>
        </label>

      </div>

      {photoPreview && (
        <div className="image-preview">
          <img src={photoPreview} alt="Preview" />
          <button type="button" onClick={removePhoto}>{t("remove")}</button>
        </div>
      )}

      {signaturePreview && (
        <div className="image-preview">
          <img src={signaturePreview} alt="Signature" />
          <button type="button" onClick={removeSignature}>{t("remove")}</button>
        </div>
      )}

      <div className="preview-row">
        {cameraOpen && (
          <div className="camera-box">
            <video ref={videoRef} autoPlay playsInline />
            <canvas ref={canvasRef} hidden />
            <div className="camera-buttons">
              <button type="button" onClick={capturePhoto}>{t("capture")}</button>

              <button type="button" onClick={closeCamera}>{t("cancel")}</button>
            </div>
          </div>
        )}

        {/* ✅ NEW: SIGNATURE CAMERA */}
        {signatureCameraOpen && (
          <div className="camera-box">
            <video ref={signatureVideoRef} autoPlay playsInline />
            <canvas ref={signatureCanvasRef} hidden />
            <div className="camera-buttons">
              <button type="button" onClick={captureSignature}>{t("capture")}</button>
              <button type="button" onClick={closeSignatureCamera}>{t("cancel")}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerMasterSection;