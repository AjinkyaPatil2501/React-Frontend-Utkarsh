import React, { useState , useEffect} from "react";
import { kycSchema } from "../../validation/schemas";
import { allowNumberOnly, validateCustomer } from "../../validation/validator";
import "../../ComponentCss/onboarding.css";
import { useTranslation } from "react-i18next";

const CompanyKycSection = ({
  data = [],
  onChange,
  companyData,
  onCompanyChange
}) => {
  const { t } = useTranslation();

  /* ================= Company Identifiers ================= */
  const [companyIds, setCompanyIds] = useState({
    panNo: companyData?.panNo || "",
    exciseNo: companyData?.exciseNo || "",
    faxNo: companyData?.faxNo || "",
    tanNo: companyData?.tanNo || "",
    salesNo: companyData?.salesNo || ""
  });

  useEffect(() => {
  if (companyData) {
    setCompanyIds({
      panNo: companyData.panNo || "",
      exciseNo: companyData.exciseNo || "",
      faxNo: companyData.faxNo || "",
      tanNo: companyData.tanNo || "",
      salesNo: companyData.salesNo || ""
    });
  }
}, [companyData]);

  const handleCompanyChange = (field, value) => {
    const updated = { ...companyIds, [field]: value };
    setCompanyIds(updated);
    onCompanyChange && onCompanyChange(updated);
  };

  /* ================= KYC State ================= */
  const [entry, setEntry] = useState({
    name: "",
    number: "",
    kycDocImage: null
  });

  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);

  const updateEntry = (field, value) => {
    const updated = { ...entry, [field]: value };
    setEntry(updated);
    setErrors(validateCustomer(updated, kycSchema));
  };

  const addOrUpdateKyc = () => {
    const validationErrors = validateCustomer(entry, kycSchema);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    const updatedList = [...data];

    if (editIndex !== null) {
      updatedList[editIndex] = entry; // 🔁 UPDATE
    } else {
      updatedList.push(entry); // ➕ ADD
    }

    onChange(updatedList);
    resetEntry();
  };

  const resetEntry = () => {
    setEntry({ name: "", number: "", kycDocImage: null });
    setEditIndex(null);
    setErrors({});
  };

  const handleImage = async (file) => {
    if (!file) return;
    const base64 = await toBase64(file);
    updateEntry("kycDocImage", base64);
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  return (
    <div className="section">

      {/* ================= Company Details ================= */}
      <h3>{t("companyDetails")}</h3>

      <div className="grid-2">
        {["panNo", "exciseNo", "faxNo", "tanNo", "salesNo"].map((field) => (
          <label key={field}>
            {t(field)} :
            <input
              value={companyIds[field]}
              onChange={(e) => { if (e.target.value.length <= 10) {handleCompanyChange(field, e.target.value)}}}
              // onKeyDown={e=>allowNumberOnly(e)}
            />
          </label>
        ))}
      </div>

      <hr />

      {/* ================= KYC Documents ================= */}
      <h3>{t("kycDocuments")}</h3>

      <label>
        {t("documentName")} :
        <input
          value={entry.name}
          onChange={(e) => { if (e.target.value.length <= 12) {updateEntry("name", e.target.value)}}}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </label>

      <label>
        {t("documentNumber")} :
        <input
          value={entry.number}
          onChange={(e) => updateEntry("number", e.target.value)}
        />
        {errors.number && <span className="error-text">{errors.number}</span>}
      </label>

      <label>
        {t("uploadImage")} :
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImage(e.target.files[0])}
        />
      </label>

      <button type="button" onClick={addOrUpdateKyc}>
        {editIndex !== null ? t("update") : t("save")}
      </button>

      {/* ================= KYC Table ================= */}
      <table className="kyc-table">
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("number")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((doc, i) => (
            <tr
              key={i}
              style={{
                cursor: "pointer",
                backgroundColor: editIndex === i ? "#eef" : "transparent"
              }}
              onClick={() => {
                setEntry(doc);
                setEditIndex(i);
                setErrors({});
              }}
            >
              <td>{doc.name}</td>
              <td>{doc.number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyKycSection;
