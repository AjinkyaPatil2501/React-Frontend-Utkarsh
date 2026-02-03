import { useTranslation } from "react-i18next";
import "../../ComponentCss/DepositMasterForm.css";
import { useEffect, useState, useRef } from "react";
import CustomerSearchModal from "./CustomerSearchModal";
import { validateCustomer } from "../../validation/validator";
import { generalTabSchema } from "../../validation/schemas";

const GeneralTab = ({ data, onChange, firstFieldRef, requiredDetails, setTableCustomers, tableCustomers }) => {
    const { i18n, t } = useTranslation();
    const isMarathi = i18n.language === "mr";

    // Add validation state
    const [errors, setErrors] = useState({});


    const showAgentFields = data.ledgerNo === "230080";
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredLedgers, setFilteredLedgers] = useState([]);
    const [showCustomerPopup, setShowCustomerPopup] = useState(false);
    const [showCustomerModal, setShowCustomerModal] = useState(false);

    // Create ref for search input
    const searchInputRef = useRef(null);
    const [searchCode, setSearchCode] = useState(data.agentCode || "");
    const [searchName, setSearchName] = useState(data.agentName || "");
    const [filteredAgents, setFilteredAgents] = useState(requiredDetails.agents);

    // useref to to highlight the next field
    const ledgerNoRef = useRef(null);
    const agentCodeRef = useRef(null);
    const customerNumberRef = useRef(null);
    const englishNameRef = useRef(null);
    const directorNoRef = useRef(null);
    const accountTypeRef = useRef(null);
    const jointAccountRef = useRef(null);

    // Add validation function
    const validateForm = () => {
        const schema = generalTabSchema(t);
        const validationErrors = validateCustomer(data, schema);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    // Validate on blur
    const handleBlur = (field) => {
        const schema = generalTabSchema(t);
        const fieldSchema = { [field]: schema[field] };
        const fieldErrors = validateCustomer(data, fieldSchema);
        setErrors(prev => ({ ...prev, ...fieldErrors }));
    };

    useEffect(() => {
        ledgerNoRef.current?.focus();
    }, []);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // If modal is open, don't move focus
            if (showModal || showCustomerPopup) {
                return;
            }
            nextRef?.current?.focus();
        }
    };




    const handleJointAccountChange = (e) => {
        const val = e.target.value;
        onChange({ jointAccount: val });
        if (val === "Yes") {
            setShowCustomerModal(true);
        }
        else if (val === "No") {
            setTableCustomers([]);
        }
    };

    const handleCustomerSelect = (customer) => {
        // avoid duplicates
        if (!tableCustomers.some((c) => c.customerId === customer.customerId)) {
            setTableCustomers((prev) => [...prev, customer]);
        }
    };
    // Auto-focus search input when modal opens
    useEffect(() => {
        if (showModal && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [showModal]);


    useEffect(() => {
        const filtered = requiredDetails.agents.filter(
            (a) =>
                a.agentCode.toLowerCase().includes(searchCode.toLowerCase()) ||
                a.agentName.toLowerCase().includes(searchCode.toLowerCase()) ||
                a.agentName.toLowerCase().includes(searchName.toLowerCase()) ||
                a.agentCode.toLowerCase().includes(searchName.toLowerCase())
        );
        setFilteredAgents(filtered);
    }, [searchCode, searchName, requiredDetails.agents]);

    // When user selects or types a code
    const handleSelectByCode = (e) => {
        const value = e.target.value;
        setSearchCode(value);

        const matched = requiredDetails.agents.find(
            (a) =>
                a.agentCode.toLowerCase() === value.toLowerCase() ||
                a.agentName.toLowerCase() === value.toLowerCase()
        );

        if (matched) {
            setSearchCode(matched.agentCode);
            setSearchName(matched.agentName);
            onChange({ agentCode: matched.agentCode, agentName: matched.agentName });
        } else {
            onChange({ agentCode: value, agentName: "" });
        }
    };

    // When user selects or types a name
    const handleSelectByName = (e) => {
        const value = e.target.value;
        setSearchName(value);

        const matched = requiredDetails.agents.find(
            (a) =>
                a.agentName.toLowerCase() === value.toLowerCase() ||
                a.agentCode.toLowerCase() === value.toLowerCase()
        );

        if (matched) {
            setSearchCode(matched.agentCode);
            setSearchName(matched.agentName);
            onChange({ agentCode: matched.agentCode, agentName: matched.agentName });
        } else {
            onChange({ agentCode: "", agentName: value });
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (!value) {
            // Show full list if search box is empty
            setFilteredLedgers(requiredDetails.gldetails);
            return;
        }

        const filtered = requiredDetails.gldetails.filter(
            (ledger) =>
                ledger.glcode.toLowerCase().startsWith(value.toLowerCase()) ||
                ledger.shortcode.toLowerCase().startsWith(value.toLowerCase()) ||
                ledger.glname.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredLedgers(filtered);
    };


    // When user selects a ledger from modal
    const handleLedgerSelect = (ledger) => {
        onChange({ ledgerNo: ledger.glcode, ledgerName: ledger.glname });
        setShowModal(false);
        setSearchText("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };



    // Fetch ledger & customer details from backend



    const openLedgerModal = () => {
        setShowModal(true);

        // Show full list initially
        setFilteredLedgers(requiredDetails.gldetails);
        setSearchText(""); // optional, reset search box
    };
    useEffect(() => {
        if (data.customerNumber) {
            fetchMemberNumber();
        }
    }, [data.customerNumber])

    const fetchMemberNumber = async () => {
        try {
            if (!data.customerNumber) return;

            const response = await fetch(
                `https://utkarsh-core-banking.onrender.com/deposite/v1/share?customerId=${data.customerNumber}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch member number");
            }

            // 🔴 BACKEND RETURNS STRING, NOT JSON
            const memberNo = await response.text();

            handleChange({
                target: {
                    name: "memberNo",
                    value: memberNo || ""
                }
            });

        } catch (err) {
            console.error("Error fetching member number:", err);
        }
    };

    const handleLedgerNoEnter = () => {
        const match = requiredDetails.gldetails.find(
            (l) =>
                l.glcode.toLowerCase() === data.ledgerNo.toLowerCase() ||
                l.shortcode.toLowerCase() === data.ledgerNo.toLowerCase()
        );

        if (match) {
            handleChange({ target: { name: "ledgerName", value: match.glname } });
            setShowModal(false); // don't open modal
        } else {
            // optional: open modal if no exact match
            setShowModal(true);
        }
    };

    const handleLedgerNoChange = (e) => {
        const value = e.target.value;
        onChange({ ledgerNo: value }); // update the value

        // check if typed value matches an existing ledger
        const match = requiredDetails.gldetails.find(
            (l) =>
                l.glcode.toLowerCase() === value.toLowerCase() ||
                l.shortcode.toLowerCase() === value.toLowerCase()
        );

        if (match) {
            onChange({ ledgerNo: match.glcode, ledgerName: match.glname });
            setShowModal(false); // close modal if open

            // ✅ USE ledger.glcode DIRECTLY
            setTimeout(() => {
                if (match.glcode === "230080") {
                    agentCodeRef.current?.focus();
                } else {
                    customerNumberRef.current?.focus();
                }
            }, 0);

        } else {
            onChange({ ledgerNo: value, ledgerName: "" });
        }
    };

    const handleCustomerNumberChange = async (e) => {
        const value = e.target.value.trim();
        onChange({ customerNumber: value, customerName: "" });

        if (!value) return;

        // Step 1: Check already selected tableCustomers
        let match = tableCustomers.find(
            (c) => c.customerId.toLowerCase() === value.toLowerCase()
        );

        if (match) {
            onChange({
                customerNumber: match.customerId,
                customerName: `${match.firstName} ${match.middleName || ""} ${match.lastName}`
            });
            // setShowCustomerModal(false);
            setShowCustomerPopup(false);
            return;
        }

        // Step 2: Fetch from backend
        try {
            const response = await fetch(
                `https://utkarsh-core-banking.onrender.com/deposite/v1/customer?customerId=${value}`
            );
            if (response.ok) {
                const customer = await response.json();
                if (customer) {
                    onChange({
                        customerNumber: customer.customerId,
                        customerName: `${customer.firstName} ${customer.middleName || ""} ${customer.lastName}`
                    });
                    // setShowCustomerModal(false);
                    setShowCustomerPopup(false);
                    return;
                }
            }
        } catch (err) {
            console.error("Customer fetch error:", err);
        }

        // Step 3: Not found → open modal for search
        // setShowCustomerModal(true);
        setShowCustomerPopup(true);
    };


    return (
        <div className="tab-panel">
            <div className="general-form-layout">
                <div className="form-column-main">
                    {/* Row 1: Khatavni Kramank */}
                    <div className="form-row">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            {t("khatavniKramank")} <span style={{ color: 'red' }}> *</span>
                        </label>
                        <div style={{ flex: 1 }}>
                            <div className="input-group" style={{ position: "relative" }}>

                                <input
                                    ref={firstFieldRef || ledgerNoRef}
                                    type="text"
                                    name="ledgerNo"
                                    value={data.ledgerNo}

                                    // onClick={openLedgerModal} // open modal with full list
                                    // onChange={handleChange}
                                    onChange={handleLedgerNoChange}
                                    onBlur={() => handleBlur('ledgerNo')}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // prevent form submission
                                            handleLedgerNoEnter();
                                            openLedgerModal();
                                        }
                                    }}
                                    style={errors.ledgerNo ? { borderColor: 'red' } : {}}

                                />


                                <input
                                    type="text"
                                    className={`extra-input ${isMarathi ? "shivaji-font" : ""}`}
                                    name="ledgerName"
                                    value={data.ledgerName || ""}
                                    disabled
                                />

                                {/* Modal Table */}
                                {showModal && (
                                    <div className="ledger-modal">
                                        <div className="ledger-modal-content">

                                            {/* 🔹 HEADER */}
                                            <div className="ledger-modal-header">
                                                <h3 className={isMarathi ? "shivaji-font" : ""}>
                                                    {t("searchgl")}
                                                </h3>
                                            </div>

                                            {/* 🔹 SEARCH */}
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                placeholder={t("search")}
                                                value={searchText}
                                                onChange={handleSearchChange}
                                                className="ledger-search-box"
                                            />

                                            {/* 🔹 SCROLLABLE TABLE */}
                                            <div className="ledger-table-wrapper">
                                                <table className="ledger-table">
                                                    <thead>
                                                        <tr>
                                                            <th>GL Code</th>
                                                            <th>Short Code</th>
                                                            <th>Ledger Name</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredLedgers.map((ledger) => (
                                                            <tr
                                                                key={ledger.glcode}
                                                                onClick={() => handleLedgerSelect(ledger)}
                                                            >
                                                                <td>{ledger.glcode}</td>
                                                                <td>{ledger.shortcode}</td>
                                                                <td className={isMarathi ? "shivaji-font" : ""}>
                                                                    {ledger.glname}
                                                                </td>
                                                            </tr>
                                                        ))}

                                                        {filteredLedgers.length === 0 && (
                                                            <tr>
                                                                <td colSpan={3} style={{ textAlign: "center" }}>
                                                                    {t("noRecordFound")}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* 🔹 FOOTER */}
                                            <div className="ledger-modal-footer">
                                                <button
                                                    className="ledger-modal-close"
                                                    onClick={() => setShowModal(false)}
                                                >
                                                    {t("close")}
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                )}

                            </div>
                            {errors.ledgerNo && (
                                <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {errors.ledgerNo}
                                </span>
                            )}

                        </div>
                    </div>

                    {/* Row 1.1: Pratinidhi Kramank - Conditionally displayed */}
                    {showAgentFields && (
                        <div className="form-row">
                            <label className={isMarathi ? "shivaji-font" : ""}>
                                {t("agentCode")}
                            </label>

                            <input
                                ref={agentCodeRef}
                                type="text"
                                value={searchCode}
                                onChange={handleSelectByCode}
                                onKeyDown={(e) => handleKeyDown(e, customerNumberRef)}
                                list="agent-codes"

                            />
                            <datalist id="agent-codes" >
                                {filteredAgents.map((a) => (
                                    <option key={a.agentCode} value={a.agentCode} className={isMarathi ? "shivaji-font" : ""}>
                                        {a.agentName}
                                    </option>
                                ))}
                            </datalist>
                        </div>
                    )}

                    {/* Row 2: Khate Kramank */}
                    <div className="form-row">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            {t("khateKramank")}
                        </label>
                        <input
                            type="text"
                            name="accountNumber"
                            value={data.accountNumber}
                            onChange={handleChange}
                            disabled
                        />
                    </div>

                    {/* Row 2.1: Agent Name - Conditionally displayed */}
                    {showAgentFields && (
                        <div className="form-row">
                            <label >
                                Agent Name
                            </label>

                            <input
                                type="text"
                                value={searchName}
                                onChange={handleSelectByName}
                                list="agent-names"
                                className={isMarathi ? "shivaji-font" : ""}
                            />
                            <datalist id="agent-names" >
                                {filteredAgents.map((a) => (
                                    <option key={a.agentName} className={isMarathi ? "shivaji-font" : ""} value={a.agentName}>
                                        {a.agentCode}
                                    </option>
                                ))}
                            </datalist>
                        </div>
                    )}

                    {/* Row 3: Grahak Kramank + Grahakachi Mahiti */}
                    <div className="form-row">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            <span> {t("grahakKramank")} <span style={{ color: 'red' }}>*</span></span>
                        </label>
                        <div style={{ flex: 1 }}>
                            <div className="input-with-button">
                                <input
                                    ref={customerNumberRef}
                                    type="text"
                                    name="customerNumber"
                                    value={data.customerNumber || ""}
                                    // readOnly
                                    // onClick={() => setShowCustomerPopup(true)}
                                    onChange={handleCustomerNumberChange}
                                    onBlur={() => handleBlur('customerNumber')}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault(); // prevent form submission
                                            setShowCustomerPopup(true);
                                            // setShowCustomerModal(true); // open modal
                                        }
                                        else {
                                            if (showAgentFields) {
                                                englishNameRef.current?.focus();
                                            } else {
                                                directorNoRef.current?.focus();
                                            }
                                        }
                                    }}
                                    style={errors.customerNumber ? { borderColor: 'red' } : {}}

                                />
                                {/* {errors.customerNumber && (
                                <span style={{ color: 'red', fontSize: '12px' }}>
                                    {errors.customerNumber}
                                </span>
                            )} */}



                                <input
                                    type="text"
                                    className={`extra-input ${isMarathi ? "shivaji-font" : ""}`}
                                    value={data.customerName || ""}
                                    disabled
                                />



                                {/* English Name separated label */}
                                {showAgentFields && (<div className="input-with-label">
                                    <label >
                                        English Name :
                                    </label>
                                    <input
                                        ref={englishNameRef}
                                        type="text"
                                        name="englishName"
                                        value={data.englishName}
                                        onChange={handleChange}
                                        onKeyDown={(e) => handleKeyDown(e, directorNoRef)}
                                        className="english-name-input"
                                        disabled={!showAgentFields}
                                    />
                                </div>)}


                            </div>
                            {errors.customerNumber && (
                                <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                    {errors.customerNumber}
                                </span>
                            )}

                            {showCustomerPopup && (
                                <CustomerSearchModal
                                    onClose={() => setShowCustomerPopup(false)}
                                    onSelect={(customer) => {
                                        onChange({
                                            customerNumber: customer.customerId,
                                            customerName: `${customer.firstName} ${customer.middleName || ""} ${customer.lastName}`
                                            // memberNo: customer
                                        });

                                        setShowCustomerPopup(false);
                                        // ✅ MOVE FOCUS AFTER SELECTION
                                        setTimeout(() => {
                                            if (showAgentFields) {
                                                englishNameRef.current?.focus();
                                            } else {
                                                directorNoRef.current?.focus();
                                            }
                                        }, 0);
                                    }}
                                />
                            )}
                        </div>
                    </div>


                    {/* Row 4: Sanchalak Kramank + English Name */}
                    <div className="form-row">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            {t("sanchalakKramank")}
                        </label>
                        <div className="split-row three-items">
                            <input
                                type="text"
                                className="extra-dropdown"
                                value={data.directorCode || ""}
                                disabled
                            />
                            <select
                                  ref={directorNoRef}
                                name="directorNo"
                                value={data.directorName || ""}
                                onChange={(e) => {
                                    const selectedName = e.target.value;
                                    const director = requiredDetails.directors.find(
                                        (d) => d.directorName === selectedName
                                    );
                                    if (director) {
                                        onChange({
                                            directorName: director.directorName, // update directorName
                                            directorCode: director.directorCode
                                        });
                                    } else {
                                        onChange({ directorName: "", directorCode: "" });
                                    }
                                        
                                    setTimeout(()=>{accountTypeRef.current?.focus()},0);

                                }}
                                className={`director-select ${isMarathi ? "shivaji-font" : ""}`}
                            >
                                <option value="">{t("select")}</option>
                                {requiredDetails.directors.map((d) => (
                                    <option
                                        key={d.directorCode}
                                        value={d.directorName}
                                        className={isMarathi ? "shivaji-font" : ""}
                                    >
                                        {d.directorName}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>

                    {/* Row 5: Sabhasad Prakar */}
                    <div className="form-row">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            {t("sabhasadNumber")}
                        </label>

                        {/* <div className="input-group"> */}
                        <div className="form-row">
                            {/* Share No (click opens table) */}
                            <input
                                type="text"
                                name="memberNo"
                                value={data.memberNo || ""}
                                disabled
                            />
                        </div>
                    </div>

                    {/* Row 7: Prakar */}
                    <div className="form-row">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            {t("prakar")}
                        </label>
                        <select
                             ref={accountTypeRef}
                            name="depositType"
                            value={data.depositType}
                            // onChange={handleChange}
                            onChange={(e)=>{handleChange(e); setTimeout(()=>{jointAccountRef.current?.focus()},0)}}

                        >
                            <option value="">{t("select")}</option>
                            <option value="G">General</option>
                            <option value="S">Staff</option>
                            <option value="Sr">Senior Citizen</option>
                            <option value="So">Society</option>
                            <option value="Sp">Special Offer</option>
                        </select>
                    </div>

                    {/* Row 8: Samayik Khate */}
                    <div className="form-row">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            {t("samayikKhate")}
                        </label>
                        <select
                            ref={jointAccountRef}

                            name="jointAccount"
                            value={data.jointAccount}
                            onChange={handleJointAccountChange}
                        >
                            <option value="">{t("select")}</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        {data.jointAccount === "Yes" && (<button type="button" className="btn-action" onClick={() => setShowCustomerModal(true)}>Joint Acc. </button>)}
                    </div>
                </div>
            </div>

            {/* Customer Table */}
            <div className="table-section">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className={isMarathi ? "shivaji-font" : ""}>
                                {t("grahakKramank")}
                            </th>
                            <th className={isMarathi ? "shivaji-font" : ""}>
                                {t("customerName")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableCustomers.length === 0 && (
                            <tr>
                                <td colSpan={2} style={{ textAlign: "center", fontStyle: "italic" }}>
                                    No customers selected
                                </td>
                            </tr>
                        )}
                        {tableCustomers.map((c) => (
                            <tr key={c.customerId}>
                                <td>{c.customerId}</td>
                                <td className={isMarathi ? "shivaji-font" : ""}>
                                    {c.firstName} {c.lastName}
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
            {/* Customer Search Modal */}
            {showCustomerModal && (
                <CustomerSearchModal
                    onClose={() => setShowCustomerModal(false)}
                    onSelect={(customer) => {
                        handleCustomerSelect(customer);
                        setShowCustomerModal(false); // close modal after selection
                    }}
                />
            )}
        </div>
    );
};

export default GeneralTab;