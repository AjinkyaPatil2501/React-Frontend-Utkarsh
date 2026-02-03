
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DepositSearch = ({ onBack, onAccountSelect }) => {
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  const [searchBy, setSearchBy] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  //Fetch initial 50 customers on page load
  useEffect(() => {
    const fetchInitialAccounts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://utkarsh-core-banking.onrender.com/deposite/v1?limit=50`
        );
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialAccounts();
  }, []);

  // Live search
  useEffect(() => {
    if (!searchValue.trim()) {
      // if search box empty, show first 50 customers again
      const fetchInitialAccounts = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `https://utkarsh-core-banking.onrender.com/deposite/v1?limit=50`
          );
          if (!res.ok) throw new Error("Failed to fetch customers");
          const data = await res.json();
          setResults(data);
        } catch (err) {
          console.error(err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      fetchInitialAccounts();
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://utkarsh-core-banking.onrender.com/deposite/v1/search?searchBy=${searchBy}&searchValue=${searchValue}&limit=50`
        );
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [searchValue, searchBy]);

  const handleNew = () => setSearchValue("");

  return (
    <div style={{ padding: 15 }}>
      {/* SEARCH BAR */}
      <div
        style={{
          border: "1px solid #999",
          padding: 10,
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10
        }}
      >

        <label>
          {t("search")}
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            style={{ marginLeft: 5 }}
          >
            <option value="id">{t("accountNumber")}</option>
            <option value="name">{t("accountHolderName")}</option>
          </select>
        </label>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={isMarathi ? "shivaji-font" : ""}
          placeholder={t("searchAccountHolder")}
          style={{ flex: 1 }}
        />

        <button onClick={handleNew}>{t("new")}</button>
      </div>

      {/* TABLE */}
      <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid #999" }}>
        <table width="100%" cellPadding="5" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#e6eef7" }}>
            <tr>
              <th>{t("accountNumber")}</th>
              <th>{t("accountHolderName")}</th>
              <th>{t("address")}</th>
              
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  {t("loading")}...
                </td>
              </tr>
            )}
            {!loading && results.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  {t("noRecords")}
                </td>
              </tr>
            )}
            {results.map((c) => (
              <tr
                key={c.accountNo}
                onClick={() => {
                  setSelectedId(c.accountNo);
                  onAccountSelect(c.accountNo);
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedId === c.accountNo ? "#ffd966" : "transparent"
                }}
              >
                <td>{c.accountNo}</td>
                <td className={isMarathi ? "shivaji-font" : ""}>{c.accountName}</td>
                <td className={isMarathi ? "shivaji-font" : ""}>{c.address}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BACK */}
      <button onClick={onBack} style={{ marginTop: 10 }}>
        {t("back")}
      </button>
    </div>
  );
};

export default DepositSearch;
