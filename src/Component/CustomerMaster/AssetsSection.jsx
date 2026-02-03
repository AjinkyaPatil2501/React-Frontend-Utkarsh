import  { useState } from "react";
import { assetSchema, assetsSummarySchema } from "../../validation/schemas";
import { validateCustomer,allowNumberOnly } from "../../validation/validator";
import { useTranslation } from "react-i18next";

const AssetsSection = ({ data = {}, onChange }) => {
  const [asset, setAsset] = useState({ name: "", amount: "" });
  // const [errors, setErrors] = useState({});
  const [summaryErrors, setSummaryErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null); // ✅ ADDED

  const { t } = useTranslation();

  const safe = {
    list: data.list || [],
    annualIncome: data.annualIncome || "",
    netWorth: data.netWorth || "",
    usableAcre: data.usableAcre || "",
    usableGuntha: data.usableGuntha || "",
    totalAcre: data.totalAcre || "",
    totalGuntha: data.totalGuntha || "",
    eAgreementDate: data.eAgreementDate || "",
    assetPhoto: data.assetPhoto || null
  };

  const photoSrc = safe.assetPhoto ? `data:image/*;base64,${safe.assetPhoto}` : null;


  const updateSummary = (field, value) => {
    const updated = { ...safe, [field]: value };
    onChange(updated);

    const validationErrors = validateCustomer(updated, assetsSummarySchema);
    setSummaryErrors(validationErrors);
  };

  const validateAndUpdate = (updated) => {
    onChange(updated);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result.split(",")[1];
        resolve(result);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handlePhotoFile = async (file) => {
    if (!file) return;
    const base64 = await fileToBase64(file);

    validateAndUpdate({
      ...safe,
      assetPhoto: base64
    });
  };

  // ✅ UPDATED (ADD + UPDATE SUPPORT)
  const addAsset = () => {
    const validationErrors = validateCustomer(asset, assetSchema);
    // setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    let updatedList = [...safe.list];

    if (editIndex !== null) {
      updatedList[editIndex] = asset; // 🔁 update
    } else {
      updatedList.push(asset); // ➕ add
    }

    onChange({ ...safe, list: updatedList });

    setAsset({ name: "", amount: "" });
    setEditIndex(null);
  };

  return (
    <div className="section">
      <h3>{t("assetsSection")}</h3>

      {/* INPUT SECTION */}
      <label>
        {t("assetName")} :
        <input
          value={asset.name}
          onChange={(e) => setAsset({ ...asset, name: e.target.value })}
        />
      </label>

      <label>
        {t("amount")} :
        <input
          value={asset.amount}
          onChange={(e) => { if (e.target.value.length <= 6) {setAsset({ ...asset, amount: e.target.value })}}}
          onKeyDown={e=>allowNumberOnly(e)}
        />
      </label>

      <button type="button" onClick={addAsset}>
        {editIndex !== null ? t("update") : t("add")}
      </button>

      {/* TABLE */}
      <table style={{marginBottom : "10px"}}>
        <thead>
          <tr>
            <th>{t("name")}</th>
            <th>{t("amount")}</th>
          </tr>
        </thead>
        <tbody>
          {safe.list.map((a, i) => (
            <tr
              key={i}
              style={{
                cursor: "pointer",
                backgroundColor: editIndex === i ? "#eef" : "transparent"
              }}
              onClick={() => {
                setAsset({ name: a.name, amount: a.amount });
                setEditIndex(i);
                // setErrors({});
              }}
            >
              <td>{a.name}</td>
              <td>{a.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid-2" >
        {/* SUMMARY SECTION */}
        <label>
          {t("annualIncome")} :
          <input
            value={safe.annualIncome}
            onChange={(e) => { if (e.target.value.length <= 10) {updateSummary("annualIncome", e.target.value)}}}
            onKeyDown={e=>allowNumberOnly(e)}
          />
          {summaryErrors.annualIncome && ( <span className="error-text">{summaryErrors.annualIncome}</span>)}
        </label>

        <label>
          {t("netWorth")} :
          <input
            value={safe.netWorth}
            onChange={(e) => { if (e.target.value.length <= 10) {updateSummary("netWorth", e.target.value)}}}
            onKeyDown={e=>allowNumberOnly(e)}
          />
          {summaryErrors.netWorth && (
            <span className="error-text">{summaryErrors.netWorth}</span>
          )}
        </label>

        <label>
          {t("usableLandAcre")} :
          <input
            value={safe.usableAcre}
            onChange={(e) => { if (e.target.value.length <= 4) {updateSummary("usableAcre", e.target.value)}}}
            onKeyDown={e=>allowNumberOnly(e)}
          />
        </label>

        <label>
          {t("usableLandGuntha")} :
          <input
            value={safe.usableGuntha}
            onChange={(e) => { if (e.target.value.length <= 4) {updateSummary("usableGuntha", e.target.value)}}}
            onKeyDown={e=>allowNumberOnly(e)}
          />
        </label>

        <label>
          {t("totalLandAcre")} :
          <input
            value={safe.totalAcre}
            onChange={(e) => { if (e.target.value.length <= 4) {updateSummary("totalAcre", e.target.value)}}}
            onKeyDown={e=>allowNumberOnly(e)}
          />
        </label>

        <label>
          {t("totalLandGuntha")} :
          <input
            value={safe.totalGuntha}
            onChange={(e) => { if (e.target.value.length <= 4) {updateSummary("totalGuntha", e.target.value)}}}
            onKeyDown={e=>allowNumberOnly(e)}
          />
        </label>

        <label>
          {t("eAgreementEndDate")} :
          <input
            type="date"
            value={safe.eAgreementDate}
            onChange={(e) => updateSummary("eAgreementDate", e.target.value)}
          />
        </label>

        {/* PHOTO */}
        <label>
          {t("uploadPhoto")}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoFile(e.target.files[0])}
          />
        </label>
      </div>
    </div>
  );
};

export default AssetsSection;