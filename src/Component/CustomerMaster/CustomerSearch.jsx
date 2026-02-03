// import { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// const CustomerSearch = ({ onBack, onCustomerSelect }) => {
//   const { i18n, t } = useTranslation();
//   const isMarathi = i18n.language === "mr";

//   const [searchBy, setSearchBy] = useState("id");
//   const [searchValue, setSearchValue] = useState("");
//   const [allCustomers, setAllCustomers] = useState([]);
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);

//   // Fetch customers
//   useEffect(() => {
//     const fetchCustomers = async () => {
//       const res = await fetch(
//         `https://utkarsh-core-banking.onrender.com/customers/v1/search?searchBy=${searchBy}&searchValue=${searchValue}&limit=50`
//       );
//       const data = await res.json();
//       setResults(data);
//     }; fetchCustomers();
//   }, []);

//   useEffect(() => {
//     const filtered = allCustomers.filter((c) => {
//       if (!searchValue.trim()) return true;

//       if (searchBy === "id") {
//         return String(c.customerId || "")
//           .replace(/^0+/, "")
//           .includes(searchValue.replace(/^0+/, ""));
//       }

//       if (searchBy === "name") {
//         return `${c.firstName || ""} ${c.middleName || ""} ${c.lastName || ""}`
//           .toLowerCase()
//           .includes(searchValue.toLowerCase());
//       }

//       return true;
//     });

//     setResults(filtered);
//   }, [searchBy, searchValue, allCustomers]);


//   const handleNew = () => {
//     setSearchValue("");
//   };

//   return (
//     <div style={{ padding: 15 }}>
//       {/* SEARCH BAR */}
//       <div
//         style={{
//           border: "1px solid #999",
//           padding: 10,
//           display: "flex",
//           alignItems: "center",
//           gap: 10,
//           marginBottom: 10
//         }}
//       >
//         <label>
//           {t("search")}

//           <select
//             value={searchBy}
//             onChange={(e) => setSearchBy(e.target.value)}
//             style={{ marginLeft: 5 }}
//           >
//             <option value="id">{t("customerId")}</option>
//             <option value="name">{t("customerName")}</option>
//           </select>
//         </label>

//         <input
//           type="text"
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className={isMarathi ? "shivaji-font" : ""}
//           placeholder={t('searchCustomer')}
//           style={{ flex: 1 }}
//         />

//         <button onClick={handleNew}>{t("new")}</button>
//       </div>



//       {/* TABLE */}
//       <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid #999" }}>
//         <table width="100%" cellPadding="5" style={{ borderCollapse: "collapse" }}>
//           <thead style={{ background: "#e6eef7" }}>
//             <tr>
//               <th>{t('customerId')}</th>
//               <th>{t("title")}</th>
//               <th>{t("firstName")}</th>
//               <th>{t("middleName")}</th>
//               <th>{t("lastName")}</th>
//               <th>{t("accountOpeningDate")}</th>
//               <th>{t("dob")}</th>
//             </tr>
//           </thead>

//           <tbody>
//             {!loading && results.length === 0 && (
//               <tr>
//                 <td colSpan={7} style={{ textAlign: "center" }}>
//                   {t("noRecords")}
//                 </td>
//               </tr>
//             )}

//             {results.map((c) => (
//               <tr
//                 key={c.customerId}
//                 onClick={() => {
//                   setSelectedId(c.customerId);
//                   onCustomerSelect && onCustomerSelect(c);
//                 }}
//                 style={{
//                   cursor: "pointer",
//                   backgroundColor:
//                     selectedId === c.customerId ? "#ffd966" : "transparent"
//                 }}
//               >
//                 <td>{c.customerId}</td>
//                 <td>{c.title}</td>
//                 <td className={isMarathi ? "shivaji-font" : ""}>{c.firstName}</td>
//                 <td className={isMarathi ? "shivaji-font" : ""}>{c.middleName}</td>
//                 <td className={isMarathi ? "shivaji-font" : ""}>{c.lastName}</td>
//                 <td>{c.accountOpenDate}</td>
//                 <td>{c.dateOfBirth}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* BACK */}
//       <button onClick={onBack} style={{ marginTop: 10 }}>
//         {t("back")}
//       </button>
//     </div>
//   );
// };

// export default CustomerSearch;



//=================================================================================================

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CustomerSearch = ({ onBack, onCustomerSelect }) => {
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  const [searchBy, setSearchBy] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch initial 50 customers on page load
  useEffect(() => {
    const fetchInitialCustomers = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://utkarsh-core-banking.onrender.com/customers/v1?limit=50`
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

    fetchInitialCustomers();
  }, []);

  // Live search
  useEffect(() => {
    if (!searchValue.trim()) {
      // if search box empty, show first 50 customers again
      const fetchInitialCustomers = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `https://utkarsh-core-banking.onrender.com/customers/v1?limit=50`
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
      fetchInitialCustomers();
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://utkarsh-core-banking.onrender.com/customers/v1/search?searchBy=${searchBy}&searchValue=${searchValue}&limit=50`
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
            <option value="id">{t("customerId")}</option>
            <option value="name">{t("customerName")}</option>
          </select>
        </label>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={isMarathi ? "shivaji-font" : ""}
          placeholder={t("searchCustomer")}
          style={{ flex: 1 }}
        />

        <button onClick={handleNew}>{t("new")}</button>
      </div>

      {/* TABLE */}
      <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid #999" }}>
        <table width="100%" cellPadding="5" style={{ borderCollapse: "collapse" }}>
          <thead style={{ background: "#e6eef7" }}>
            <tr>
              <th>{t("customerId")}</th>
              <th>{t("title")}</th>
              <th>{t("firstName")}</th>
              <th>{t("middleName")}</th>
              <th>{t("lastName")}</th>
              <th>{t("accountOpeningDate")}</th>
              <th>{t("dob")}</th>
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
                key={c.customerId}
                onClick={() => {
                  setSelectedId(c.customerId);
                  onCustomerSelect && onCustomerSelect(c);
                }}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedId === c.customerId ? "#ffd966" : "transparent"
                }}
              >
                <td>{c.customerId}</td>
                <td>{c.title}</td>
                <td className={isMarathi ? "shivaji-font" : ""}>{c.firstName}</td>
                <td className={isMarathi ? "shivaji-font" : ""}>{c.middleName}</td>
                <td className={isMarathi ? "shivaji-font" : ""}>{c.lastName}</td>
                <td>{c.accountOpenDate}</td>
                <td>{c.dateOfBirth}</td>
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

export default CustomerSearch;
