import { useState } from "react";
import { allowNumberOnly, allowTextOnly } from "../../validation/validator";
import { useTranslation } from "react-i18next";

const CompanyAddressSection = ({ data = {}, onChange, errors = {}, touched = {}, personalDetails = {} }) => {
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  const [safe, setSafe] = useState({
    local: {
      country: data.local?.country || "",
      state: data.local?.state || "",
      district: data.local?.district || "",
      taluka: data.local?.taluka || "",
      city: data.local?.city || "",
      address: data.local?.address || "",
      wardNo: data.local?.wardNo || "",
      pincode: data.local?.pincode || "",
      phone1: data.local?.phone1 || "",
      phone2: data.local?.phone2 || "",
      mobile1: data.local?.mobile1 || "",
      mobile2: data.local?.mobile2 || "",
      email: data.local?.email || "",
      website: data.local?.website || ""
    },
    permanent: {
      country: data.permanent?.country || "",
      state: data.permanent?.state || "",
      district: data.permanent?.district || "",
      taluka: data.permanent?.taluka || "",
      city: data.permanent?.city || "",
      address: data.permanent?.address || "",
      wardNo: data.permanent?.wardNo || "",
      pincode: data.permanent?.pincode || "",
      phone1: data.permanent?.phone1 || "",
      phone2: data.permanent?.phone2 || "",
      mobile1: data.permanent?.mobile1 || "",
      mobile2: data.permanent?.mobile2 || "",
      email: data.permanent?.email || "",
      website: data.permanent?.website || ""
    }
  });

  // ✅ FIXED: Helper to check if field should show error
  const shouldShowError = (field) => {
    return touched?.[field] && errors?.[field];
  };

  const update = (section, field, value) => {
    const updated = {
      ...safe,
      [section]: { ...safe[section], [field]: value }
    };

    setSafe(updated);
    onChange(updated);
  };

  const renderAddressBlock = (title, section) => (
    <div className="address-block" >
      <h4>{title}</h4>

      {/* <label>
        {t("country")} :
        <select
          value={safe[section].country}
          onChange={(e) => update(section, "country", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("country") ? "input-error" : ""}`}
        >
          <option value="">{t("select")}</option>
          <option value="India">{t("india")}</option>
        </select>
        {shouldShowError("country") && (
          <span className="error-text">{errors.country}</span>
        )}
      </label> */}

      <label>
        {t("country")} :
        <select
          value={safe[section].country}
          onChange={e => update(section, "country", e.target.value)}
          className={isMarathi ? "shivaji-font" : ""}
          style={{padding:10}}
        >
          <option value="">{t("select")}</option>
          {personalDetails.countryList.map(country => (
            <option key={country.countryId} value={country.countryId}>
              {country.countryName}
            </option>
          ))}
        </select>
        {errors[section]?.country && (
          <span className="error-text">{errors[section].country}</span>
        )}
      </label>

      {/* <label>
        <span>{t("state")} <span className="required">*</span></span>
        <select
          value={safe[section].state}
          onChange={(e) => update(section, "state", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("state") ? "input-error" : ""}`}
        >
          <option value="">{t("select")}</option>
          <option value="Maharashtra">{t("maharashtra")}</option>
        </select>
        {shouldShowError("state") && (
          <span className="error-text">{errors.state}</span>
        )}
      </label> */}

      <label>
        {t("state")} :
        <select
          value={safe[section].state}
          onChange={e => update(section, "state", e.target.value)}
          // className={isMarathi ? "shivaji-font" : ""}
          className={`${isMarathi ? "shivaji-font" : ""} ${errors[section]?.state ? "input-error" : ""}`}
        >
          <option value="">{t("select")}</option>
          {personalDetails.stateList
            .filter(state => state.countryId === safe[section].country)
            .map(state => (
              <option key={state.stateId} value={state.stateId}>
                {state.stateName}
              </option>
            ))}
        </select>
        {errors[section]?.state && (
          <span className="error-text">{errors[section].state}</span>
        )}
      </label>

      {/* <label>
        {t("district")} :
        <input
          value={safe[section].district}
          onChange={(e) => update(section, "district", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("district") ? "input-error" : ""}`}
        />
        {shouldShowError("district") && (
          <span className="error-text">{errors.district}</span>
        )}
      </label> */}


      <label>
        {t("district")} :
        <select
          value={safe[section].district}
          onChange={e => update(section, "district", e.target.value)}
          className={isMarathi ? "shivaji-font" : ""}
        >
          <option value="">{t("select")}</option>
          {personalDetails.districtList
            .filter(d => d.stateId === Number(safe[section].state))
            .map(d => (
              <option key={d.districtId} value={d.districtId}>
                {d.districtName}
              </option>
            ))}
        </select>
        {errors[section]?.district && (
          <span className="error-text">{errors[section].district}</span>
        )}
      </label>

      {/* <label>
        {t("taluka")} :
        <input
          value={safe[section].taluka}
          onChange={(e) => update(section, "taluka", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("taluka") ? "input-error" : ""}`}
        />
        {shouldShowError("taluka") && (
          <span className="error-text">{errors.taluka}</span>
        )}
      </label> */}

      <label>
        {t("taluka")} :
        <select
          value={safe[section].taluka}
          onChange={e => update(section, "taluka", e.target.value)}
          className={isMarathi ? "shivaji-font" : ""}
        >
          <option value="">{t("select")}</option>
          {personalDetails.talukaList
            .filter(tl => tl.districtId === Number(safe[section].district))
            .map(tl => (
              <option key={tl.talukaId} value={tl.talukaId}>
                {tl.talukaName}
              </option>
            ))}
        </select>
        {errors[section]?.taluka && (
          <span className="error-text">{errors[section].taluka}</span>
        )}
      </label>

      {/* <label>
        <span>{t("cityVillage")} <span className="required">*</span></span>
        <input
          value={safe[section].city}
          onChange={(e) => update(section, "city", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("city") ? "input-error" : ""}`}
        />
        {shouldShowError("city") && (
          <span className="error-text">{errors.city}</span>
        )}
      </label> */}

      <label>
        {t("cityVillage")} :
        <select
          value={safe[section].city}
          onChange={e => update(section, "city", e.target.value)}
          // className={isMarathi ? "shivaji-font" : "" } 
          className={`${isMarathi ? "shivaji-font" : ""} ${errors[section]?.city ? "input-error" : ""}`}
        >
          <option value="">{t("select")}</option>
          {personalDetails.cityList
            .filter(c => c.talukaId === Number(safe[section].taluka))
            .map(c => (
              <option key={c.cityCode} value={c.cityCode}>
                {c.cityName}
              </option>
            ))}
        </select>
        {errors[section]?.city && (
          <span className="error-text">{errors[section].city}</span>
        )}
      </label>

      <label>
        {t("address")} :
        <textarea
          value={safe[section].address}
          onChange={(e) => update(section, "address", e.target.value)}
          className={`${isMarathi ? "shivaji-font" : ""} ${shouldShowError("address") ? "input-error" : ""}`}
        />
        {shouldShowError("address") && (
          <span className="error-text">{errors.address}</span>
        )}
      </label>

      {/* <label>
        {t("wardNo")} :
        <select
          value={safe[section].wardNo}
          onChange={(e) => update(section, "wardNo", e.target.value)}
          className={shouldShowError("wardNo") ? "input-error" : ""}
        >
          <option value="">{t("select")}</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        {shouldShowError("wardNo") && (
          <span className="error-text">{errors.wardNo}</span>
        )}
      </label> */}

      <label>
        {t("wardNo")} :
        <select
          value={safe[section].wardNo}
          onChange={e => update(section, "wardNo", e.target.value)}
        >
          <option value="">{t("select")}</option>
          {personalDetails.wardList
            .filter(w => w.cityCode === Number(safe[section].city))
            .map(w => (
              <option key={w.wardId} value={w.wardId}>
                {w.wardName}
              </option>
            ))}
        </select>
        {errors[section]?.wardNo && (
          <span className="error-text">{errors[section].wardNo}</span>
        )}
      </label>


      <label>
        {t("pincode")} :
        <input
          value={safe[section].pincode}
          onChange={(e) => { if (e.target.value.length <= 6) { update(section, "pincode", e.target.value) } }}
          onKeyDown={e => { allowNumberOnly(e) }}
          className={shouldShowError("pincode") ? "input-error" : ""}
        />
        {shouldShowError("pincode") && (
          <span className="error-text">{errors.pincode}</span>
        )}
      </label>

      <label>
        {t("phoneNo1")} :
        <input
          value={safe[section].phone1}
          onChange={(e) => { if (e.target.value.length <= 10) { update(section, "phone1", e.target.value) } }}
          onKeyDown={e => { allowNumberOnly(e) }}
          className={shouldShowError("phone1") ? "input-error" : ""}
        />
        {shouldShowError("phone1") && (
          <span className="error-text">{errors.phone1}</span>
        )}
      </label>

      <label>
        {t("phoneNo2")} :
        <input
          value={safe[section].phone2}
          onChange={(e) => { if (e.target.value.length <= 10) { update(section, "phone2", e.target.value) } }}
          onKeyDown={e => { allowNumberOnly(e) }}
          className={shouldShowError("phone2") ? "input-error" : ""}
        />
        {shouldShowError("phone2") && (
          <span className="error-text">{errors.phone2}</span>
        )}
      </label>

      <label>
        {t("email")} :
        <input
          type="email"
          value={safe[section].email}
          onChange={(e) => update(section, "email", e.target.value)}
          className={shouldShowError("email") ? "input-error" : ""}
        />
        {shouldShowError("email") && (
          <span className="error-text">{errors.email}</span>
        )}
      </label>

      <label>
        {t("website")} :
        <input
          type="text"
          value={safe[section].website}
          onChange={(e) => update(section, "website", e.target.value)}
          className={shouldShowError("website") ? "input-error" : ""}
        />
        {shouldShowError("website") && (
          <span className="error-text">{errors.website}</span>
        )}
      </label>
    </div>
  );

  return (
    <div className="section">
      <h3>{t("companyAddress")}</h3>
      {renderAddressBlock(t("permanentAddress"), "permanent")}
    </div>
  );
};

export default CompanyAddressSection;