import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../ComponentCss/CustomerSearchModal.css";

const CustomerSearchModal = ({ onClose, onSelect }) => {
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  const [searchText, setSearchText] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load first 50 customers
  useEffect(() => {
    fetchCustomers("");
  }, []);

  const fetchCustomers = async (text) => {
    setLoading(true);
    try {
        const searchBy = /^\d+$/.test(text.trim()) ? "id" : "name";
      const url = text
        ? `https://utkarsh-core-banking.onrender.com/customers/v1/search?searchBy=${searchBy}&searchValue=${encodeURIComponent(
            text
          )}&limit=50`
        : `https://utkarsh-core-banking.onrender.com/customers/v1?limit=50`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Fetch failed");

      const result = await res.json();
      setCustomers(result);
    } catch (err) {
      console.error("Customer fetch failed", err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers(searchText.trim());
    }, 200);

    return () => clearTimeout(timer);
  }, [searchText]);

  
  return (
    <div className="customer-modal">
      <div className="customer-modal-content">
        <h3>{t("searchCustomer")}</h3>

        <input
          type="text"
          placeholder={t("searchCustomer")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={`customer-search-box ${isMarathi ? "shivaji-font" : ""}`}
          autoFocus
        />

        <div className="customer-table-wrapper">
          <table className="customer-table">
            <thead>
              <tr>
                <th>{t("customerId")}</th>
                <th>{t("customerName")}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    {t("loading")}...
                  </td>
                </tr>
              )}

              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center" }}>
                    {t("noRecords")}
                  </td>
                </tr>
              )}

              {customers.map((c) => (
                <tr
                  key={c.customerId}
                  onClick={() => {
                    onSelect(c);
                    onClose();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <td>{c.customerId}</td>
                  <td className={isMarathi ? "shivaji-font" : ""}>
                    {c.firstName} {c.middleName} {c.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="modal-close-btn" onClick={onClose}>
          {t("close")}
        </button>
      </div>
    </div>
  );
};

export default CustomerSearchModal;
