import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import GeneralTab from "./GeneralTab";
import PersonalInfoTab from "./PersonalInfoTab";
import FinancialInfoTab from "./FinancialInfoTab";
import DepositTab from "./DepositTab";
import DepositSearch from "./DepositSearch";
import SavingsCurrentTab from "./SavingsCurrentTab";
import "../../ComponentCss/DepositMasterForm.css";
import { validateCustomer } from "../../validation/validator";
import { generalTabSchema, financialInfoTabSchema, savingsCurrentTabSchema } from "../../validation/schemas";

const initialFormData = {
    // General Tab
    ledgerNo: "",
    agentCode: "",
    agentName: "",
    accountNumber: "",
    customerNumber: "",
    directorCode: "",
    directorName: "",

    englishName: "",
    memberType: "",
    memberNo: "",
    depositType: "",
    jointAccount: "",

    // Personal Info Tab
    address: "",
    city: "",
    phone: "",
    specialInstruction: "",
    nomineeName: "",
    introducerName: "",
    introducerAddress: "",
    introducerCity: "",
    checkBook: "",
    form15H: "",
    smsService: "",

    // Financial Info Tab
    openingDate: "",
    asOnDate: "",
    termMonths: "",
    termDays: "",
    maturityDate: "",
    interestPeriodMonths: "",
    depositAmount: "",
    interestRate: "",
    maturityAmount: "",
    autoRenewal: "",
    withInterest: "",
    interestLedgerNo: "",
    interestLedgerName: "",
    interestAccountNo: "",
    interestAccountName: "",
    includeInRecovery: "",
    customerName: "",
    // Thev Tab
    depositReceiptNo: "",
    deductInterest: "" || "Y",
    isPrinted: "N",

    // Savings/Current Tab
    savingsOpeningDate: "",
    savingsAmount: "",
    savingsInterestRate: "",
    isTemporaryLoan: "",
    tempLoanLimit: "",
    tempLoanInterestRate: "",
    tempLoanEndDate: "",
    isRecovery: "",
    tableCustomers: ""
};

const DepositMasterForm = () => {
    const { i18n, t } = useTranslation();
    const isMarathi = i18n.language === "mr";
    const navigate = useNavigate();
    const firstFieldRef = useRef(null);

    const [activeTab, setActiveTab] = useState(0);
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState(initialFormData);
    const [formEnabled, setFormEnabled] = useState(false);
    const [selectedDepositId, setSelectedDepositId] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [requiredDetails, setRequiredDetails] = useState({
        gldetails: [],
        agents: [],
        directors: []
    });
    const [tableCustomers, setTableCustomers] = useState([]);
    const showSubmitBar = formEnabled && !selectedDepositId;

    const updateSection = (updates) => {
        setFormData(prev => {
            const newData = { ...prev, ...updates };

            // If ledger number changes and is not 230080, clear agent fields
            if (updates.ledgerNo !== undefined && updates.ledgerNo !== "230080") {
                newData.agentCode = "";
                newData.agentName = "";
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate General Tab
        const generalSchema = generalTabSchema(t);
        const generalErrors = validateCustomer(formData, generalSchema);

        // Validate Financial Tab (custom validation)
        const financialErrors = {};

        // Check period
        if (!formData.termMonths && !formData.termDays) {
            financialErrors.termPeriod = t("errors.required", { field: t("kalavadhi") });
        }

        // Check deposit amount
        const depositSchema = financialInfoTabSchema(t);
        const depositErrors = validateCustomer(formData, depositSchema);
        Object.assign(financialErrors, depositErrors);

        // Validate Savings Tab
        const savingsSchema = savingsCurrentTabSchema(t);
        const savingsErrors = validateCustomer(formData, savingsSchema);

        // Combine all errors
        const allErrors = {
            ...generalErrors,
            ...financialErrors,
            ...savingsErrors
        };

        if (Object.keys(allErrors).length > 0) {
            console.log("Validation errors:", allErrors);

            // Determine which tab has errors
            if (Object.keys(generalErrors).length > 0) {
                setActiveTab(0);
                alert(t("errors.pleaseFillRequired") + " (General Tab)");
            } else if (Object.keys(financialErrors).length > 0) {
                setActiveTab(2);
                alert(t("errors.pleaseFillRequired") + " (Financial Tab)");
            } else if (Object.keys(savingsErrors).length > 0) {
                setActiveTab(4);
                alert(t("errors.pleaseFillRequired") + " (Savings Tab)");
            }
            return;
        }

        const jointcustomers = tableCustomers.map(c => ({
            customerId: c.customerId,
            caccountNo: null
        }));

        setMessage("");

        /* 🔹 Backend request object */
        const payload = {
            bankId: localStorage.getItem("bankId"),
            branchId: localStorage.getItem("branchId"),
            ledgerNo: formData.ledgerNo,
            accountNumber: formData.accountNumber,
            customerNumber: formData.customerNumber,
            englishName: formData.englishName,
            depositType: formData.depositType,
            memberType: formData.memberType,

            address: formData.address,
            city: formData.city,
            phone: formData.phone,
            nomineeName: formData.nomineeName,

            openingDate: formData.openingDate,
            asOnDate: formData.asOnDate,
            termMonths: formData.termMonths,
            termDays: formData.termDays,
            maturityDate: formData.maturityDate,
            autoRenewal: formData.autoRenewal,
            directorCode: formData.directorNo,
            introducerName: formData.introducerName,
            introducerCity: formData.introducerCity,
            introducerAddress: formData.introducerAddress,
            customerName: formData.customerName,

            depositAmount: Number(formData.depositAmount),
            interestRate: Number(formData.interestRate),
            maturityAmount: Number(formData.maturityAmount),

            interestLedgerNo: formData.interestLedgerNo,
            interestLedgerName: formData.interestLedgerName,
            interestAccountNo: formData.interestAccountNo,
            interestAccountName: formData.interestAccountName,

            depositReceiptNo: formData.depositReceiptNo,
            isPrinted: formData.isPrinted,

            form15H: formData.form15H,
            smsService: formData.smsService,
            savingsAmount: formData.savingsAmount,
            savingsOpeningDate: formData.savingsOpeningDate,
            savingsInterestRate: formData.savingsInterestRate,
            isTemporaryLoan: formData.isTemporaryLoan,
            tempLoanLimit: formData.tempLoanLimit,
            tempLoanInterestRate: formData.tempLoanInterestRate,
            tempLoanEndDate: formData.tempLoanEndDate,
            isRecovery: formData.isRecovery,
            jointcustomers: jointcustomers,
            includeInRecovery: formData.includeInRecovery,
            specialInstruction: formData.specialInstruction,
            withInterest: formData.withInterest,
            interestPeriodMonths: formData.interestPeriodMonths,
            deductInterest: formData.deductInterest ? "A" : "N",

        };
        try {
            const res = await fetch("https://utkarsh-core-banking.onrender.com/deposite/v1/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await res.json();

            if (!res.ok) {
                alert(result.message || "Deposit creation failed");
                return;
            }

            alert(result.message || "Deposit created successfully");

        } catch (err) {
            alert("Server error. Please try again.");
        }
    };


    const handleNew = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFormData(initialFormData);
        setFormEnabled(true);
        setSelectedDepositId(null);
        setMessage("");
        setActiveTab(0);

        setTimeout(() => {
            firstFieldRef.current?.focus();
        }, 0);
    };

    const handleSearch = () => {
        setShowSearch(true);
    };

    // const handleUpdate = async () => {
    //     if (!selectedDepositId) {
    //         alert("No deposit selected for update");
    //         return;
    //     }

    //     try {
    //         const response = await fetch(
    //             `https://utkarsh-core-banking.onrender.com/deposits/v1/update/${selectedDepositId}`,
    //             {
    //                 method: "PATCH",
    //                 credentials: "include",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(formData)
    //             }
    //         );

    //         if (!response.ok) {
    //             throw new Error("Update failed");
    //         }

    //         setMessage(t("updateSuccess"));
    //         alert("Deposit updated successfully ✅");

    //         setFormEnabled(false);
    //         setFormData(initialFormData);
    //         setSelectedDepositId(null);
    //     } catch (error) {
    //         console.error("Update error:", error);
    //         alert("Unable to update deposit");
    //     }
    // };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedDepositId) {
            alert("No deposit selected for update");
            return;
        }

        // Validation (same as create)
        const generalSchema = generalTabSchema(t);
        const generalErrors = validateCustomer(formData, generalSchema);

        const financialErrors = {};
        if (!formData.termMonths && !formData.termDays) {
            financialErrors.termPeriod = t("errors.required", { field: t("kalavadhi") });
        }

        const depositSchema = financialInfoTabSchema(t);
        const depositErrors = validateCustomer(formData, depositSchema);
        Object.assign(financialErrors, depositErrors);

        const savingsSchema = savingsCurrentTabSchema(t);
        const savingsErrors = validateCustomer(formData, savingsSchema);

        const allErrors = {
            ...generalErrors,
            ...financialErrors,
            ...savingsErrors
        };

        if (Object.keys(allErrors).length > 0) {
            console.log("Validation errors:", allErrors);

            if (Object.keys(generalErrors).length > 0) {
                setActiveTab(0);
                alert(t("errors.pleaseFillRequired") + " (General Tab)");
            } else if (Object.keys(financialErrors).length > 0) {
                setActiveTab(2);
                alert(t("errors.pleaseFillRequired") + " (Financial Tab)");
            } else if (Object.keys(savingsErrors).length > 0) {
                setActiveTab(4);
                alert(t("errors.pleaseFillRequired") + " (Savings Tab)");
            }
            return;
        }

        const jointcustomers = tableCustomers.map(c => ({
            customerId: c.customerId,
            caccountNo: null
        }));

        const payload = {
            bankId: localStorage.getItem("bankId"),
            branchId: localStorage.getItem("branchId"),
            ledgerNo: formData.ledgerNo,
            accountNumber: formData.accountNumber,
            customerNumber: formData.customerNumber,
            englishName: formData.englishName,
            depositType: formData.depositType,
            memberType: formData.memberType,
            address: formData.address,
            city: formData.city,
            phone: formData.phone,
            nomineeName: formData.nomineeName,
            openingDate: formData.openingDate,
            asOnDate: formData.asOnDate,
            termMonths: formData.termMonths,
            termDays: formData.termDays,
            maturityDate: formData.maturityDate,
            autoRenewal: formData.autoRenewal,
            directorCode: formData.directorNo,
            introducerName: formData.introducerName,
            introducerCity: formData.introducerCity,
            introducerAddress: formData.introducerAddress,
            customerName: formData.customerName,
            depositAmount: Number(formData.depositAmount),
            interestRate: Number(formData.interestRate),
            maturityAmount: Number(formData.maturityAmount),
            interestLedgerNo: formData.interestLedgerNo,
            interestLedgerName: formData.interestLedgerName,
            interestAccountNo: formData.interestAccountNo,
            interestAccountName: formData.interestAccountName,
            depositReceiptNo: formData.depositReceiptNo,
            isPrinted: formData.isPrinted,
            form15H: formData.form15H,
            smsService: formData.smsService,
            savingsAmount: formData.savingsAmount,
            savingsOpeningDate: formData.savingsOpeningDate,
            savingsInterestRate: formData.savingsInterestRate,
            isTemporaryLoan: formData.isTemporaryLoan,
            tempLoanLimit: formData.tempLoanLimit,
            tempLoanInterestRate: formData.tempLoanInterestRate,
            tempLoanEndDate: formData.tempLoanEndDate,
            isRecovery: formData.isRecovery,
            jointcustomers: jointcustomers,
            includeInRecovery: formData.includeInRecovery,
            specialInstruction: formData.specialInstruction,
            withInterest: formData.withInterest,
            interestPeriodMonths: formData.interestPeriodMonths,
            deductInterest: formData.deductInterest ? "A" : "N",
        };

        try {
            const response = await fetch(
                `https://utkarsh-core-banking.onrender.com/deposite/v1/update/${selectedDepositId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Update failed");
                return;
            }

            alert(result.message || "Deposit updated successfully ✅");
            setMessage(t("updateSuccess"));

            setFormEnabled(false);
            setFormData(initialFormData);
            setSelectedDepositId(null);
            setTableCustomers([]);

        } catch (error) {
            console.error("Update error:", error);
            alert("Server error. Unable to update deposit");
        }
    };

    const handleSelectDeposit = async (accountNo) => {
        try {
            const response = await fetch(
                `https://utkarsh-core-banking.onrender.com/deposite/v1/account/${accountNo}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch deposit details");
            }

            const data = await response.json();

            setFormData({
                ledgerNo: data.ledgerNo || "",
                accountNumber: data.accountNumber || "",
                customerNumber: data.customerNumber || "",
                englishName: data.englishName || "",
                memberType: data.memberType || "",
                memberNo: data.memberNo || "",
                depositType: data.depositType || "",
                jointAccount: data.jointAccount || "",
                address: data.address || "",
                city: data.city || "",
                phone: data.phone || "",
                specialInstruction: data.specialInstruction || "",
                nomineeName: data.nomineeName || "",
                introducerName: data.introducerName || "",
                introducerAddress: data.introducerAddress || "",
                introducerCity: data.introducerCity || "",
                checkBook: data.checkBook || "",
                form15H: data.form15H || "",
                smsService: data.smsService || "",
                openingDate: data.openingDate || "",
                asOnDate: data.asOnDate || "",
                termMonths: data.termMonths || "",
                termDays: data.termDays || "",
                maturityDate: data.maturityDate || "",
                interestPeriodMonths: data.interestPeriodMonths || "",
                depositAmount: data.depositAmount || "",
                interestRate: data.interestRate || "",
                maturityAmount: data.maturityAmount || "",
                autoRenewal: data.autoRenewal || "",
                withInterest: data.withInterest || "",
                interestLedgerNo: data.interestLedgerNo || "",
                interestLedgerName: data.interestLedgerName || "",
                interestAccountNo: data.interestAccountNo || "",
                interestAccountName: data.interestAccountName || "",
                includeInRecovery: data.includeInRecovery || "",
                customerName: data.customerName || "",
                directorCode: data.directorCode || "",
                directorName: data.directorName || "",
                depositReceiptNo: data.depositReceiptNo || "",
                deductInterest: data.deductInterest || "",
                isPrinted: data.isPrinted || "N",
                savingsOpeningDate: data.savingsOpeningDate || "",
                savingsAmount: data.savingsAmount || "",
                savingsInterestRate: data.savingsInterestRate || "",
                isTemporaryLoan: data.isTemporaryLoan || "",
                tempLoanLimit: data.tempLoanLimit || "",
                tempLoanInterestRate: data.tempLoanInterestRate || "",
                tempLoanEndDate: data.tempLoanEndDate || "",
                isRecovery: data.isRecovery || "",
            });

            if (data.jointcustomers && data.jointcustomers.length > 0) {
                setTableCustomers(data.jointcustomers);
            }

            setSelectedDepositId(accountNo);
            setFormEnabled(true);
            setShowSearch(false);
            setActiveTab(0);

        } catch (error) {
            console.error("Error loading deposit:", error);
            alert("Failed to load deposit details");
        }
    };

    const handleCancel = () => {
        setFormEnabled(false);
        setFormData(initialFormData);
        setSelectedDepositId(null);
        setMessage("");
    };

    const handleExit = () => {
        setFormEnabled(false);
        navigate("/navbar");
    };

    const tabs = [
        { id: 0, label: t("generalTab") },
        { id: 1, label: t("personalInfoTab") },
        { id: 2, label: t("financialInfoTab") },
        { id: 3, label: t("depositTab") },
        { id: 4, label: t("savingsCurrentTab") }
    ];
    useEffect(() => {
        const fetchAllDetails = async () => {
            try {
                const response = await fetch(
                    "https://utkarsh-core-banking.onrender.com/deposite/v1/alldetails"
                );
                const data = await response.json(); // parse JSON
                setRequiredDetails(data);
            } catch (error) {
                console.error("Failed to fetch deposit details", error);
            }
        };

        fetchAllDetails();
    }, []);
    return (
        <div className="deposit-master-container">
            {/* Message */}
            {message && (
                <div className={`message ${message.includes("success") || message.includes("यशस्वी") ? "success" : "error"}`}>
                    {message}
                </div>
            )}

            {/* Form wrapper */}
            <div className="deposit-form-wrapper">
                {showSearch ? (
                    // <div style={{ margin: 10 }}>
                    //     <p>Search Component Here</p>
                    //     <button onClick={() => setShowSearch(false)}>{t("close")}</button>
                    // </div>

                    <div style={{ margin: 10 }}>
                        <DepositSearch
                            onBack={() => setShowSearch(false)}
                            // onAccountSelect={handleAccountSelect}
                            onAccountSelect={handleSelectDeposit}
                        />

                        {/* <button onClick={() => setShowSearch(false)}>{t("close")}</button> */}
                    </div>

                ) : (
                    <>
                        {/* Tab Navigation: always clickable */}
                        <div className="tab-navigation">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    className={`tab-button ${activeTab === tab.id ? "active" : ""} ${isMarathi ? "shivaji-font" : ""}`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Form fields */}
                        <form
                            id="deposit-form"
                            className="deposit-form"
                            onSubmit={handleSubmit}
                            noValidate
                            autoComplete="off"
                        >
                            <fieldset disabled={!formEnabled}>
                                <div className="tab-content">
                                    {activeTab === 0 && <GeneralTab data={formData} onChange={updateSection} firstFieldRef={firstFieldRef} requiredDetails={requiredDetails} tableCustomers={tableCustomers} setTableCustomers={setTableCustomers} />}
                                    {activeTab === 1 && <PersonalInfoTab data={formData} onChange={updateSection} />}
                                    {activeTab === 2 && <FinancialInfoTab data={formData} onChange={updateSection} requiredDetails={requiredDetails} />}
                                    {activeTab === 3 && <DepositTab data={formData} onChange={updateSection} />}
                                    {activeTab === 4 && <SavingsCurrentTab data={formData} onChange={updateSection} />}
                                </div>
                            </fieldset>
                        </form>
                    </>
                )}
            </div>

            {/* Fixed Footer Buttons */}
            {!showSearch && (
                <div className="form-footer fixed-footer">
                    {!showSubmitBar ? (
                        <>
                            {/* <div className="footer-left">
                                <button type="button" className="btn-secondary" onClick={() => window.open('/customer-master', '_blank')}>
                                    {t("customerMaster")}
                                </button>
                                <button type="button" className="btn-secondary">{t("renewAccount")}</button>
                            </div> */}

                            <div className="button-group">
                                <button type="button" onClick={handleNew} className="btn-action">{t("new")}</button>
                                <button type="button" onClick={handleSearch} className="btn-action">{t("search")}</button>
                                <button type="button" onClick={handleUpdate} className="btn-action" disabled={!selectedDepositId}>{t("update")}</button>
                                <button type="button" onClick={handleExit} className="btn-action">{t("close")}</button>
                            </div>
                        </>
                    ) : (
                        <div className="button-group">
                            <button type="submit" form="deposit-form" className="btn-action">{t("submit")}</button>
                            <button type="button" className="btn-action" onClick={handleCancel}>{t("cancel")}</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DepositMasterForm;