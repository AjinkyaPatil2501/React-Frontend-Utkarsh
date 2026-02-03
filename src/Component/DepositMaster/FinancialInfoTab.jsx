import { useTranslation } from "react-i18next";
import "../../ComponentCss/DepositMasterForm.css";
import { useEffect, useState } from "react";
import GeneralLedgerModal from "./GeneralLedgerModal";
import { validateCustomer } from "../../validation/validator";
import { financialInfoTabSchema } from "../../validation/schemas";

const FinancialInfoTab = ({ data, onChange, requiredDetails }) => {
    const { i18n, t } = useTranslation();
    const isMarathi = i18n.language === "mr";

    // Add validation state
    const [errors, setErrors] = useState({});


    // Validate period fields
    const validatePeriod = () => {
        if (!data.termMonths && !data.termDays) {
            setErrors(prev => ({ 
                ...prev, 
                termPeriod: t("errors.required", { field: t("kalavadhi") }) 
            }));
            return false;
        } else {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.termPeriod;
                return newErrors;
            });
            return true;
        }
    };

    // Add validation function
    const handleBlurValidate = (field) => {
        if (field === 'termMonths' || field === 'termDays') {
            validatePeriod();
        } else if (field === 'depositAmount') {
            const schema = financialInfoTabSchema(t);
            const fieldSchema = { [field]: schema[field] };
            const fieldErrors = validateCustomer(data, fieldSchema);
            setErrors(prev => ({ ...prev, ...fieldErrors }));
        }
    };

    const [showAccountModal, setShowAccountModal] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [localValue, setLocalValue] = useState(data.depositAmount || "");
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };
    
   



    useEffect(() => {
        if (
            data.depositAmount &&
            data.ledgerNo &&
            (data.termDays || data.termMonths)
        ) {
            fetchInterestRate();
        }
    }, [
        data.depositAmount,
        data.ledgerNo,
        (data.termDays || data.termMonths)
    ]);


    const fetchInterestRate = async () => {
        try {
            let forTime;
            let dayOrMonth;
            if (data.termDays) {
                forTime = data.termDays;
                dayOrMonth = "D";
            } else if (data.termMonths) {
                forTime = data.termMonths;
                dayOrMonth = "M"
            }
            const params = new URLSearchParams({
                // depositAmount: data.depositAmount,
                glCode: data.ledgerNo,
                forTime: forTime,
                dayOrMonth: dayOrMonth
            });

            const response = await fetch(
                `https://utkarsh-core-banking.onrender.com/deposite/v1/interest?${params}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            if (!response.ok) {
                throw new Error("Failed to fetch interest rate");
            }

            // 🔴 BACKEND RETURNS STRING, NOT JSON
            const interest = await response.text();;

            handleChange({
                target: {
                    name: "interestRate",
                    value: interest || ""
                }
            });
        } catch (err) {
            console.error("Error fetching interest rate:", err);
        }
    }

    useEffect(() => {
        if (data.customerNumber) {
            fetchStartDate();
        }
    }, [data.customerNumber]);

    const fetchStartDate = async () => {
        try {
            if (!data.customerNumber) return;

            // console.log("branchId is = " + localStorage.getItem("branchId"))
            const response = await fetch(`https://utkarsh-core-banking.onrender.com/deposite/v1/startdate?branchId=${localStorage.getItem("branchId")}`);

            if (!response.ok) {
                throw new Error("Failed to fetch start date");
            }

            // 🔴 BACKEND RETURNS STRING, NOT JSON
            const startDate = await response.json();;

            handleChange({
                target: {
                    name: "openingDate",
                    value: startDate || ""
                }
            });

            handleChange({
                target: {
                    name: "asOnDate",
                    value: startDate || ""
                }
            });
        } catch (err) {
            console.error("Error fetching member number:", err);
        }
    }

    useEffect(() => {
        const maturityDate = calculateMaturityDate(
            data.asOnDate,
            data.termDays,
            data.termMonths
        );

        if (maturityDate && maturityDate !== data.maturityDate) {
            handleChange({
                target: {
                    name: "maturityDate",
                    value: maturityDate
                }
            });
        }
    }, [data.asOnDate, data.termDays, data.termMonths]);

    const calculateMaturityDate = (asOnDate, termDays, termMonths) => {
        if (!asOnDate) return "";

        const date = new Date(asOnDate);

        // 🔹 Day-based term
        if (termDays && Number(termDays) > 0) {
            date.setDate(date.getDate() + Number(termDays));
        }
        // 🔹 Month-based term (NO day addition)
        else if (termMonths && Number(termMonths) > 0) {
            const originalDay = date.getDate();
            const targetMonth = date.getMonth() + Number(termMonths);

            // Move to first day of target month
            date.setDate(1);
            date.setMonth(targetMonth);

            // Get last day of target month
            const lastDayOfMonth = new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0
            ).getDate();

            // Restore day safely
            date.setDate(Math.min(originalDay, lastDayOfMonth));
        } else {
            return "";
        }

        return date.toISOString().split("T")[0];
    };


    /* 🔹 Fetch when modal opens or search text changes */
    useEffect(() => {
        if (!showAccountModal || !data.interestLedgerNo) return;

        const timer = setTimeout(() => {
            fetchAccounts(searchText);
        }, 200);

        return () => clearTimeout(timer);
    }, [searchText, showAccountModal, data.interestLedgerNo]);

    /* 🔹 Fetch default 50 when ledger changes AND modal is open */
    useEffect(() => {
        if (data.interestLedgerNo && showAccountModal) {
            fetchAccounts("");
        }
    }, [data.interestLedgerNo, showAccountModal]);

    const fetchAccounts = async (text = "") => {
        setLoading(true);

        try {
            const trimmedText = text?.trim() || "";

            const searchBy = /^\d+$/.test(trimmedText)
                ? "accountNumber"
                : "accountName";

            const baseUrl = "https://utkarsh-core-banking.onrender.com/deposite/v1/accountsforglcode";

            const url = trimmedText
                ? `${baseUrl}?branchId=${localStorage.getItem("branchId")}&glCode=${data.interestLedgerNo}&searchBy=${searchBy}&searchValue=${encodeURIComponent(trimmedText)}&limit=50`
                : `${baseUrl}?branchId=${localStorage.getItem("branchId")}&glCode=${data.interestLedgerNo}&limit=50`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Account fetch failed");

            const result = await res.json();
            setAccounts(Array.isArray(result) ? result : []);
            console.log("Accounts:", result);
        } catch (err) {
            console.error("Error fetching accounts:", err);
            setAccounts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (data.ledgerNo, data.termMonths, data.interestRate, data.depositAmount) {
            fetchMaturityAmount();
        }
    }, [data.ledgerNo, data.termMonths, data.interestRate, data.depositAmount])
    const fetchMaturityAmount = async () => {
        try {
            const params = new URLSearchParams({
                glCode: data.ledgerNo,
                month: data.termMonths,
                days: data.termDays,
                depositAmount: data.depositAmount,
                frequency: data.interestPeriodMonths,
                type: data.depositType,
                interestRate: data.interestRate
            });
            const response = await fetch(`https://utkarsh-core-banking.onrender.com/deposite/v1/maturityamount?${params}`)
            const amount = await response.text();
            handleChange({
                target: {
                    name: "maturityAmount",
                    value: amount || ""
                }
            });
        } catch (error) {
            console.error("Error fetching Maturity Amount:", error);
        }
    }
    const handleInputChange = (e) => {
        const value = e.target.value;

        // allow only numbers and dot
        if (/^\d*\.?\d*$/.test(value)) {
            setLocalValue(value);
            handleChange({
                target: { name: "depositAmount", value }
            });
        }
    };

    const handleBlur = () => {
        // format to 2 decimals on blur
        const formatted = parseFloat(localValue || 0).toFixed(2);
        setLocalValue(formatted);
        handleChange({
            target: { name: "depositAmount", value: formatted }
        });
    };
    return (
        <div className="tab-panel">
            <div className="personal-info-form">
                {/* Suruvatichi Dinak (Start Date) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("suruvatichiDinak")}
                    </label>
                    <input
                        type="date"
                        name="openingDate"
                        value={data.openingDate}
                        onChange={handleChange}
                        className="half-width-input"
                    // disabled
                    />
                </div>

                {/* As on Date */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("asOnDate")}
                    </label>
                    <input
                        type="date"
                        name="asOnDate"
                        value={data.asOnDate}
                        onChange={handleChange}
                        className="half-width-input"
                    // disabled
                    />
                </div>

                {/* Kalavadhi (Period) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                       <span>{t("kalavadhi")} <span style={{ color: 'red' }}>*</span></span>
                    </label>
                    <div style={{ flex: 1 }}>
                    <div className="split-row">
                        <div className="input-with-label">
                            <input
                                type="number"
                                name="termMonths"
                                value={data.termMonths || ""}
                                min={0}
                                onChange={handleChange}
                                onBlur={() => handleBlurValidate('termMonths')}
                                className="small-input"
                                style={errors.termPeriod ? { borderColor: 'red' } : {}}
                            />
                            <span className={isMarathi ? "shivaji-font" : ""}>
                                {t("mahine")}
                            </span>
                        </div>
                        <div className="input-with-label">
                            <input
                                type="number"
                                name="termDays"
                                value={data.termDays || ""}
                                min={0}
                                onChange={handleChange}
                                onBlur={() => handleBlurValidate('termDays')}
                                className="small-input"
                                style={errors.termPeriod ? { borderColor: 'red' } : {}}

                            />
                            <span className={isMarathi ? "shivaji-font" : ""}>
                                {t("divas")}
                            </span>
                        </div>
                    </div>
                      {errors.termPeriod && (
                            <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                {errors.termPeriod}
                            </span>
                        )}
                </div>
                </div>

                {/* Shevatchi Dinak (End Date) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("shevatchiDinak")}
                    </label>
                    <input
                        type="date"
                        name="maturityDate"
                        value={data.maturityDate}
                        onChange={handleChange}
                        className="half-width-input"
                        min={new Date().toISOString().split("T")[0]}
                        disabled
                    />
                </div>

                {/* Vyaj Varga Kalavadhi */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("interestFrequency")}
                    </label>
                    <div className="input-with-label">
                        <select
                            name="interestPeriodMonths"
                            value={data.interestPeriodMonths}
                            onChange={handleChange}
                            className="small-select"
                        >
                            <option value="">{t("select")}</option>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="3">3</option>
                            <option value="6">6</option>
                            <option value="12">12</option>
                        </select>
                        <span className={isMarathi ? "shivaji-font" : ""}>
                            {t("mahine")}
                        </span>
                    </div>
                </div>

                {/* Thevnichi Rakkam (Deposit Amount) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                       <span>{t("thevnichiRakkam")} <span style={{ color: 'red' }}>*</span></span>
                    </label>
                  
                    <div style={{ flex: 1 }}>
                    <input
                        type="text"
                        name="depositAmount"
                        value={data.depositAmount ||""}
                        onChange={handleInputChange}
                        onBlur={()=>{handleBlur(); handleBlurValidate('depositAmount')}}
                        className="amount-field half-width-input"
                        placeholder="0.00"
                        style={errors.depositAmount ? { borderColor: 'red' } : {}}
                    />
                       {errors.depositAmount && (
                            <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                {errors.depositAmount}
                            </span>
                        )}
                </div>
                </div>

                {/* Vyajacha Dar (Interest Rate) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("vyajachaDar")}
                    </label>
                    <input
                        type="text"
                        name="interestRate"
                        value={data.interestRate}
                        onChange={handleChange}
                        className="amount-field half-width-input"
                        placeholder="0.00"
                        readOnly
                    />
                </div>

                {/* Mudatiantan Deya Rakkam (Maturity Amount) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("mudatiantanDeyaRakkam")}
                    </label>
                    <input
                        type="text"
                        name="maturityAmount"
                        value={data.maturityAmount}
                        onChange={handleChange}
                        className="amount-field half-width-input"
                        placeholder="0.00"
                        readOnly
                    />
                </div>

                {/* Purnaguntavnuk (Reinvestment) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("autoRenewal")}
                    </label>
                    <select
                        name="autoRenewal"
                        value={data.autoRenewal}
                        onChange={handleChange}
                        className="small-select"
                    >
                        <option value="">{t("select")}</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                {/* Vyajasaha (With Interest) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("vyajasaha")}
                    </label>
                    <select
                        name="withInterest"
                        value={data.withInterest}
                        onChange={handleChange}
                        className="small-select"
                    >
                        <option value="">{t("select")}</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                {/* Vyaj Varga Khtavni (Interest Ledger) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("vyajVargaKhtavni")}
                    </label>
                    <div className="split-row">
                        <GeneralLedgerModal
                            requiredDetails={requiredDetails.gldetails}
                            data={data}
                            handleChange={(e) => {
                                handleChange(e);
                                handleChange({
                                    target: {
                                        name: "interestAccountNo",
                                        value: ""
                                    }
                                });
                                handleChange({
                                    target: {
                                        name: "interestAccountName",
                                        value: ""
                                    }
                                });
                            }}

                            t={t}
                            isMarathi={isMarathi}
                        />
                    </div>
                </div>

                {/* Vyaj Varga Khate (Interest Account) */}
                {/* <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("vyajVargaKhate")}
                    </label>
                    <div className="split-row">
                        <select
                            name="interestAccountNo"
                            value={data.interestAccountNo}
                            onChange={handleChange}
                            className="small-select"
                        >
                            <option value="">{t("select")}</option>
                        </select>
                        <select
                            name="interestAccountName"
                            value={data.interestAccountName}
                            onChange={handleChange}
                            className="form-select flex-1"
                        >
                            <option value="">{t("select")}</option>
                        </select>
                    </div>
                </div> */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("vyajVargaKhate")}
                    </label>

                    <div className="split-row">
                        <input
                            type="text"
                            value={data.interestAccountNo || ""}
                            placeholder={t("select")}
                            // readOnly

                            className="small-input"
                            onFocus={() => {
                                setShowAccountModal(true);
                                setSearchText("");
                            }}
                        />

                        <input
                            type="text"
                            value={data.interestAccountName || ""}
                            readOnly
                            className={`form-input flex-1 ${isMarathi ? "shivaji-font" : ""}`}
                        />

                        {showAccountModal && (
                            <div className="customer-modal">
                                <div className="customer-modal-content">
                                    <h3>{t("searchAccount")}</h3>

                                    <input
                                        type="text"
                                        placeholder={t("searchAccount")}
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className={`customer-search-box ${isMarathi ? "shivaji-font" : ""}`}
                                        autoFocus
                                    />

                                    <div className="customer-table-wrapper">
                                        <table className="customer-table">
                                            <thead>
                                                <tr>
                                                    <th>{t("accountNo")}</th>
                                                    <th>{t("accountName")}</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {loading && (
                                                    <tr>
                                                        <td colSpan={2} align="center">
                                                            {t("loading")}...
                                                        </td>
                                                    </tr>
                                                )}

                                                {!loading && accounts.length === 0 && (
                                                    <tr>
                                                        <td colSpan={2} align="center">
                                                            {t("noRecords")}
                                                        </td>
                                                    </tr>
                                                )}

                                                {accounts.map((acc) => (
                                                    <tr
                                                        key={acc.caccountNo}
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => {
                                                            handleChange({
                                                                target: {
                                                                    name: "interestAccountNo",
                                                                    value: acc.caccountNo?.slice(-8)
                                                                }
                                                            });
                                                            handleChange({
                                                                target: {
                                                                    name: "interestAccountName",
                                                                    value: acc.cheadShor
                                                                }
                                                            });
                                                            setShowAccountModal(false);
                                                            setSearchText("");
                                                        }}
                                                    >
                                                        <td>{acc.caccountNo?.slice(-8)}</td>
                                                        <td className={isMarathi ? "shivaji-font" : ""}>
                                                            {acc.cheadShor}
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    </div>

                                    <button
                                        className="modal-close-btn"
                                        onClick={() => setShowAccountModal(false)}
                                    >
                                        {t("close")}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                {/* Vasuli Patrakat... (Include in Recovery) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("vasuliPatrakatGhyayacheKa")}
                    </label>
                    <select
                        name="includeInRecovery"
                        value={data.includeInRecovery}
                        onChange={handleChange}
                        className="small-select"
                    >
                        <option value="">{t("select")}</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FinancialInfoTab;