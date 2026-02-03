import { useState } from "react";
import { businessSchema } from "../../validation/schemas";
import { validateCustomer, allowNumberOnly } from "../../validation/validator";
import { useTranslation } from "react-i18next";

const BusinessSection = ({ data = {}, onChange, personalDetails = {} }) => {
  const [errors, setErrors] = useState({});
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  const safe = {
    occupation: data.occupation || "",
    address: data.address || "",
    occupationType: data.occupationType || "",
    email: data.email || "",
    phone1: data.phone1 || "",
    phone2: data.phone2 || ""
  };

  const update = (field, value) => {
    const updated = { ...safe, [field]: value };
    onChange(updated);

    const validationErrors = validateCustomer(updated, businessSchema);
    setErrors(validationErrors);
  };

  const Occupation = {
    GOVT: "Government",
    PRIVATE: "Private",
    BUSINESS: "Business",
    STUDENT: "Student",
    HOUSEWIFE: "Housewife",
    OCC1: "Retired",
    OTHER: "Other",
  };

  return (
    <div className="section">
      <h3>{t("businessInformation")}</h3>

      <div className="grid-2">
        <label>
          {t("occupation")} :
          <select
            value={safe.occupation || ""}
            onChange={(e) => update("occupation", e.target.value)}
            className={isMarathi ? "shivaji-font" : ""}
          >
            <option value="">{t("select")}</option>

            {(personalDetails.occupationList || []).map((occ) => (
              <option key={occ.occupationId} value={occ.occupationId}>
                {occ.occupationName}
              </option>
            ))}
          </select>

          {errors.occupation && (
            <span className="error-text">{errors.occupation}</span>
          )}
        </label>
        <label>
          {t("occupationType")} :
          <input
            value={safe.occupationType}
            onChange={(e) => update("occupationType", e.target.value)}
            className={isMarathi ? "shivaji-font" : ""}
          />
        </label>

        <label>
          {t("address")} :
          <textarea
            value={safe.address}
            onChange={(e) => update("address", e.target.value)}
            className={isMarathi ? "shivaji-font" : ""}
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </label>

        <label>
          {t("email")} :
          <input
            value={safe.email}
            onChange={(e) => update("email", e.target.value)}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </label>



        <label>
          {t("phoneNo1")} :
          <input
            value={safe.phone1}
            onChange={(e) => { if (e.target.value.length <= 10) { update("phone1", e.target.value) } }}
            onKeyDown={e => allowNumberOnly(e)}
          />
        </label>

        <label>
          {t("phoneNo2")} :
          <input
            value={safe.phone2}
            onChange={(e) => { if (e.target.value.length <= 10) { update("phone2", e.target.value) } }}
            onKeyDown={e => allowNumberOnly(e)}
          />
        </label>
      </div>
    </div>
  );
};

export default BusinessSection;