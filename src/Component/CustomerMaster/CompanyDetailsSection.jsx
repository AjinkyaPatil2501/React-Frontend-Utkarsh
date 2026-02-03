import { allowTextOnly } from "../../validation/validator";
import { useTranslation } from "react-i18next";
import "../../ComponentCss/onboarding.css";

const CompanyDetailsSection = ({ data = {}, onChange, errors = {}, touched = {} }) => {
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";
  
  const safe = {
    name: data.name || "",
    constitution: data.constitution || "",
    nature: data.nature || "",
    estDate: data.estDate || ""
  };

  const update = (field, value) => {
    const updated = { ...safe, [field]: value };
    onChange(updated);
  };

  // ✅ FIXED: Helper to check if field should show error
  const shouldShowError = (field) => {
    return touched?.[field] && errors?.[field];
  };

  return (
    <div className="section">
      <h3>{t("companyFirmDetails")}</h3>

      <label>
        <span>{t("companyFirmName")} <span className="required">*</span></span>
        <input
          value={safe.name}
          onChange={(e) => update("name", e.target.value)}
          onKeyDown={e => { allowTextOnly(e, isMarathi) }}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("companyname") ? "input-error" : ""}`}
        />
        {shouldShowError("companyname") && <span className="error-text">{errors.companyname}</span>}
      </label>

      <label>
        <span>{t("constitution")}</span>
        <select
          value={safe.constitution}
          onChange={(e) => update("constitution", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("constitution") ? "input-error" : ""}`}
        >
          <option value="">{t("select")}</option>
          <option>{t("soleProprietorship")}</option>
          <option>{t("partnership")}</option>
          <option>{t("pvtLtd")}</option>
        </select>
        {shouldShowError("constitution") && <span className="error-text">{errors.constitution}</span>}
      </label>

      <label>
        <span>{t("natureOfBusiness")}</span>
        <input
          value={safe.nature}
          onChange={(e) => update("nature", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("nature") ? "input-error" : ""}`}
          onKeyDown={e => allowTextOnly(e, isMarathi)}
        />
        {shouldShowError("nature") && <span className="error-text">{errors.nature}</span>}
      </label>

      <label>
        <span>{t("dateOfEstablishment")} <span className="required">*</span></span>
        <input
          type="date"
          value={safe.estDate}
          onChange={(e) => update("estDate", e.target.value)}
          className={shouldShowError("dateOfEstablishment") ? "input-error" : ""}
        />
        {shouldShowError("dateOfEstablishment") && <span className="error-text">{errors.dateOfEstablishment}</span>}
      </label>
    </div>
  );
};

export default CompanyDetailsSection;