import { useTranslation } from "react-i18next";
 
const CustomerBasicInfo = ({
  customerType = "Individual",
  customerId ,
  onTypeChange,
}) => {
  const { t } = useTranslation();
  return (
    <div className="section">
      <h3>{t("basicCustomerInformation")}</h3>

      <label>
        {t("customerType")} :
        <select
          value={customerType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="Individual">{t("individual")}</option>
          <option value="Company">{t("company")}</option>
        </select>
      </label>

      <label>
        {t("customerId")} :
        <input
          type="text"
          value={customerId}
          disabled
        />
      </label>
    </div>
  );
};

export default CustomerBasicInfo;