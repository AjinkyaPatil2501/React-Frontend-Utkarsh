import  { useState } from "react";
import { partnerSchema } from "../../validation/schemas";
import { allowNumberOnly, allowTextOnly, validateCustomer } from "../../validation/validator";
import { useTranslation } from "react-i18next";

const PartnerSection = ({ data = [], onChange }) => {
  const [partner, setPartner] = useState({
    customerId: "",
    name: "",
    pan: "",
    mobile: ""
  });
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null); // ✅ Track edit row
   const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  const updatePartner = (field, value) => {
    const updated = { ...partner, [field]: value };
    setPartner(updated);

    const validationErrors = validateCustomer(updated, partnerSchema);
    setErrors(validationErrors);
  };

  const addPartner = () => {
    const validationErrors = validateCustomer(partner, partnerSchema);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    let updatedList = [...data];

    if (editIndex !== null) {
      updatedList[editIndex] = partner; // 🔁 Update existing row
    } else {
      updatedList.push(partner); // ➕ Add new row
    }

    onChange(updatedList);

    setPartner({ customerId: "", name: "", pan: "", mobile: "" });
    setEditIndex(null);
  };

  return (
    <div className="section">
      <h3>{t("partnersSection")}</h3>

      <label>
        {t("customerId")} :
        <input
          value={partner.customerId}
          onChange={(e) => { if (e.target.value.length <= 12) {updatePartner("customerId", e.target.value)}}}
          onKeyDown={e=>{allowNumberOnly(e)}}
        />
        {errors.customerId && <span className="error-text">{errors.customerId}</span>}
      </label>

      <label>
        {t("name")} :
        <input
          value={partner.name}
          onChange={(e) => updatePartner("name", e.target.value)}
          onKeyDown={e=>{allowTextOnly(e,isMarathi)}}
          className={isMarathi ? "shivaji-font" : ""}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </label>

      <label>
        {t("pan")} :
        <input
          value={partner.pan}
          onChange={(e) => { if (e.target.value.length <= 10) {updatePartner("pan", e.target.value.toUpperCase())}}}
        />
      </label>

      <label>
        {t("mobile")} :
        <input
          value={partner.mobile}
          onChange={(e) => { if (e.target.value.length <= 10) {updatePartner("mobile", e.target.value)}}}
          onKeyDown={e=>allowNumberOnly(e)}
        />
        {errors.mobile && <span className="error-text">{errors.mobile}</span>}
      </label>

      <button type="button" onClick={addPartner}>
        {editIndex !== null ? t("update") : t("addPartner")}
      </button>

      <table>
        <thead>
          <tr>
            <th>{t("customerId")}</th>
            <th>{t("name")}</th>
            <th>{t("pan")}</th>
            <th>{t("mobile")}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((p, i) => (
            <tr
              key={i}
              style={{
                cursor: "pointer",
                backgroundColor: editIndex === i ? "#eef" : "transparent"
              }}
              onClick={() => {
                setPartner({
                  customerId: p.customerId,
                  name: p.name,
                  pan: p.pan,
                  mobile: p.mobile
                });
                setEditIndex(i);
                setErrors({});
              }}
            >
              <td>{p.customerId}</td>
              <td>{p.name}</td>
              <td>{p.pan}</td>
              <td>{p.mobile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnerSection;
