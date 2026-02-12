import React, { useState, useEffect } from "react";
import "../../ComponentCss/LoanMaster.css";

const CustomerSearchModal = ({ t, isMarathi, onClose, onSelect }) => {
    const [searchValue, setSearchValue] = useState("");
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getCustomerName = (c) =>
        [c.firstName, c.middleName, c.lastName]
            .filter(Boolean)
            .join(" ");

    // Load first 50 customers
    useEffect(() => {
        fetchCustomers("");
    }, []);

    // 🔹 debounce search (prevents blinking)
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers(searchValue.trim());
        }, 200);

        return () => clearTimeout(timer);
    }, [searchValue]);

    const fetchCustomers = async (text) => {
        setLoading(true);
        try {
            const searchBy = /^\d+$/.test(text) ? "id" : "name";
            const url = text
                ? `http://localhost:8181/customers/v1/search?searchBy=${searchBy}&searchValue=${encodeURIComponent(
                      text
                  )}&limit=50`
                : `http://localhost:8181/customers/v1?limit=50`;

            const res = await fetch(url);
            if (!res.ok) throw new Error("Fetch failed");

            const result = await res.json();
            setCustomers(result); // ✅ DO NOT clear before setting
        } catch (err) {
            console.error("Customer fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter((c) => {
        const fullName = getCustomerName(c).toLowerCase();

        return (
            searchValue === "" ||
            c.customerId.includes(searchValue) ||
            fullName.includes(searchValue.toLowerCase())
        );
    });

    return (
        <div className="modal-overlay higher-zindex">
            <div
                className={`modal-content customer-search-modal ${
                    loading ? "loading" : ""
                }`}
            >
                {/* Header */}
                <div className="modal-header blue-header">
                    <h3 className={isMarathi ? "shivaji-font" : ""}>
                        {t("search")}
                    </h3>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {/* Search */}
                <div className="search-section">
                    <div className="search-row">
                        <label className="search-label">
                            {t("byCustomerName")}
                        </label>

                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="form-control search-input"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="modal-body">
                    <table className="customer-search-table">
                        <thead>
                            <tr>
                                <th>{t("customerId")}</th>
                                <th>{t("customerName")}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCustomers.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="2" style={{ textAlign: "center" }}>
                                        {t("noRecords")}
                                    </td>
                                </tr>
                            )}

                            {filteredCustomers.map((customer) => (
                                <tr
                                    key={customer.customerId}
                                    className="ledger-row"
                                    onClick={() => {
                                        onSelect(customer);
                                        onClose();
                                    }}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{customer.customerId}</td>
                                    <td className={isMarathi ? "shivaji-font" : ""}>
                                        {getCustomerName(customer)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* subtle loader – no blink */}
                    {loading && (
                        <div style={{ textAlign: "center", marginTop: 8, opacity: 0.6 }}>
                            {t("loading")}...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerSearchModal;
