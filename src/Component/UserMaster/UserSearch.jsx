import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const UserSearch = ({ onBack, onUserSelect }) => {
  const [searchBy, setSearchBy] = useState("id"); // "id" or "name"
  const [searchValue, setSearchValue] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  // Fetch all users on mount
  useEffect(() => {
    const fetchAllUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://utkarsh-core-banking.onrender.com/users/v1");
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setAllUsers(data);
        setResults(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  // Live search with exact ID match and partial name match
  useEffect(() => {
    const filtered = allUsers.filter((u) => {
      if (!searchValue.trim()) return true;

      if (searchBy === "id") {
        const userId = u.cuserId ?? "";
        const normalizedId = String(userId).replace(/^0+/, "");
        const normalizedSearch = searchValue.replace(/^0+/, "");
        return normalizedId === normalizedSearch; // exact match
      } else {
        const name = u.cuserName ?? "";
        return String(name).toLowerCase().includes(searchValue.toLowerCase());
      }
    });

    setResults(filtered);
  }, [searchValue, searchBy, allUsers]);

  const handleNew = () => {
    setSearchValue("");
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 15, display: "flex", alignItems: "center", gap: "10px" }}>
        <label>
          {t("find")}:
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            style={{ marginLeft: 5 }}
          >
            <option value="id">{t("byUserId")}</option>
            <option value="name">{t("byUserName")}</option>
          </select>
        </label>
        <input
          type="text"
          value={searchValue}
          placeholder={searchBy === "id" ? t("enterUserId") : t("enterUserName")}
          className={isMarathi ? "shivaji-font" : ""}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{ flex: 1, padding: 5 }}
        />
        <button onClick={handleNew}>{t("new")}</button>
      </div>

      <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ccc" }}>
        <table width="100%" cellPadding="5" border="1" style={{ borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>{t("bankNameCol")}</th>
              <th>{t("branchNameCol")}</th>
              <th>{t("idCol")}</th>
              <th>{t("shortNameCol")}</th>
              <th>{t("designationCol")}</th>
              <th>{t("userNameCol")}</th>
              <th>{t("mobileCol")}</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 && !loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center" }}>
                  {t("noRecords")}
                </td>
              </tr>
            ) : (
              results.map((u) => (
                <tr
                  key={u.cuserId}
                  onClick={() => onUserSelect(u)}
                  style={{ cursor: "pointer" }}
                  title={t("clickToSelect")}
                >
                  <td>{u.cbankId}</td>
                  <td>{u.cbranId}</td>
                  <td>{u.cuserId}</td>
                  <td>{u.cuserInit}</td>
                  <td>{u.cuserStat}</td>
                  <td className={isMarathi ? "shivaji-font" : ""}>{u.cuserName}</td>
                  <td>{u.mobno}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button onClick={onBack} style={{ marginTop: 15 }}>
        {t("back")}
      </button>
    </div>
  );
};

export default UserSearch;