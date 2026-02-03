// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";

// const CompanySearch = ({ onBack, onCompanySelect }) => {
//   const { i18n, t } = useTranslation();
//   const isMarathi = i18n.language === "mr";


//   const [searchValue, setSearchValue] = useState("");
//   const [allCompanies, setAllCompanies] = useState([]);
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [searchBy, setSearchBy] = useState("id");


//   // Fetch companies
//   useEffect(() => {
//     const fetchCompanies = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch("https://utkarsh-core-banking.onrender.com/customers/v1/fullCompany");
//         if (!res.ok) throw new Error("Failed to fetch companies");
//         const data = await res.json();
//         setAllCompanies(data);
//         setResults(data);
//       } catch (e) {
//         alert(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCompanies();
//   }, []);
//   //Added Company & customer
//  useEffect(() => {
//   const filtered = allCompanies.filter((c) => {
//     if (!searchValue.trim()) return true;

//     if (searchBy === "id") {
//       return String(c.customerId || "")
//         .replace(/^0+/, "")
//         .includes(searchValue.replace(/^0+/, ""));
//     }

//     if (searchBy === "name") {
//       return (c.companyName || "")
//         .toLowerCase()
//         .includes(searchValue.toLowerCase());
//     }

//     return true;
//   });

//   setResults(filtered);
// }, [searchBy, searchValue, allCompanies]);


//   const handleNew = () => {
//     setSearchValue("");
//   };

//   return (
//     <div>
//       {/* Search bar */}
//       <div>
//         <label>
//           {t("search")}
//           <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
//             <option value="id">{t("companyId")}</option>
//             <option value="name">{t("companyName")}</option>
//           </select>
//         </label>

//         <input
//           type="text"
//           value={searchValue}
//           onChange={(e) => setSearchValue(e.target.value)}
//           className={isMarathi ? "shivaji-font" : ""}
//         />

//         <button onClick={handleNew}>{t("new")}</button>
//       </div>

//       {/* Table */}
//       <div>
//         <table>
//           <thead>
//             <tr>
//               <th>{t("companyId")}</th>
//               <th>{t("companyName")}</th>
//               <th>{t("constitution")}</th>
//               <th>{t("natureOfBusiness")}</th>
//               <th>{t("dateOfEstablishment")}</th>
//             </tr>
//           </thead>
//           <tbody>
//             {!loading && results.length === 0 && (
//               <tr>
//                 <td colSpan={5}>{t("noRecords")}</td>
//               </tr>
//             )}

//             {results.map((c) => (
//               <tr
//                 key={c.companyId}
//                 onClick={() => {
//                   setSelectedId(c.companyId);
//                   onCompanySelect && onCompanySelect(c);
//                 }}
//               >
//                 <td>{c.customerId}</td>
//                 <td className={isMarathi ? "shivaji-font" : ""}>{c.companyName}</td>
//                 <td>{c.constitutionType}</td>
//                 <td>{c.natureOfBusiness}</td>
//                 <td>{c.dateOfEstablishment}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Back */}
//       <button onClick={onBack}>{t("back")}</button>
//     </div>
//   );
// };

// export default CompanySearch;




//================ Above code Works Fine (Fetch 50 records & Live Search) =====================================


import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../ComponentCss/CustomerMasterSearch.css";

const CompanySearch = ({ onBack, onCompanySelect }) => {
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";

  const [searchBy, setSearchBy] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // 🔹 Initial fetch – first 50 companies
  useEffect(() => {
    const fetchInitialCompanies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://utkarsh-core-banking.onrender.com/customers/v1/company?limit=50"
        );
        if (!res.ok) throw new Error("Failed to fetch companies");
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCompanies();
  }, []);

  // 🔹 Live search (backend)
  useEffect(() => {
    if (!searchValue.trim()) {
      const fetchInitialCompanies = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            "https://utkarsh-core-banking.onrender.com/customers/v1/company?limit=50"
          );
          const data = await res.json();
          setResults(data);
        } finally {
          setLoading(false);
        }
      };
      fetchInitialCompanies();
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://utkarsh-core-banking.onrender.com/customers/v1/company/search?searchBy=${searchBy}&searchValue=${searchValue}&limit=50`
        );
        if (!res.ok) throw new Error("Search failed");
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
    <div className="search-wrapper">
      {/* SEARCH BAR */}
      <div className="search-bar">
        
        <label>
          {t("search")}
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
          >
            <option value="id">{t("companyId")}</option>
            <option value="name">{t("companyName")}</option>
          </select>
        </label>

        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={isMarathi ? "shivaji-font" : ""}
          placeholder={t("searchCompany")}
        />

        <button onClick={handleNew}>{t("new")}</button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>{t("companyId")}</th>
              <th>{t("companyName")}</th>
              <th>{t("constitution")}</th>
              <th>{t("natureOfBusiness")}</th>
              <th>{t("dateOfEstablishment")}</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="center">
                  {t("loading")}...
                </td>
              </tr>
            )}

            {!loading && results.length === 0 && (
              <tr>
                <td colSpan="5" className="center">
                  {t("noRecords")}
                </td>
              </tr>
            )}

            {results.map((c) => (
              <tr
                key={c.customerId}
                onClick={() => {
                  setSelectedId(c.customerId);
                  onCompanySelect && onCompanySelect(c);
                }}
                className={selectedId === c.customerId ? "selected-row" : ""}
              >
                <td>{c.customerId}</td>
                <td className={isMarathi ? "shivaji-font" : ""}>{c.companyName}</td>
                <td>{c.constitutionType}</td>
                <td>{c.natureOfBusiness}</td>
                <td>{c.dateOfEstablishment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* BACK */}
      <button className="back-btn" onClick={onBack}>
        {t("back")}
      </button>
    </div>
  );
};

export default CompanySearch;
