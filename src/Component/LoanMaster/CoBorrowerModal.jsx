import React, { useState } from "react";
import CustomerSearchModal from "./CustomerSearchModal";
import "../../ComponentCss/LoanMaster.css";

const CoBorrowerModal = ({ t, isMarathi, onClose }) => {
    const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false);
    const [coBorrowers, setCoBorrowers] = useState([]); // ✅ TABLE DATA

    const handleSearch = () => {
        setIsCustomerSearchOpen(true);
    };

    const handleDelete = (customerId) => {
        setCoBorrowers(prev =>
            prev.filter(cb => cb.customerId !== customerId)
        );
    };

    const handleOk = () => {
        onClose();
    };

    const handleCustomerSelect = (customer) => {
        setCoBorrowers(prev => {
            // ❌ prevent duplicate entries
            const exists = prev.some(
                cb => cb.customerId === customer.customerId
            );
            if (exists) return prev;

            return [
                ...prev,
                {
                    customerId: customer.customerId,
                    name: `${customer.firstName} ${customer.middleName || ""} ${customer.lastName || ""}`.trim(),
                    joinDate: new Date().toLocaleDateString(),
                    isOperated: "N",
                    priority: prev.length + 1
                }
            ];
        });

        setIsCustomerSearchOpen(false);
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content co-borrower-modal">

                    {/* Header */}
                    <div className="modal-header blue-header">
                        <h3 className={isMarathi ? "shivaji-font" : ""}>
                            {t("coBorrower")}
                        </h3>
                        <button
                            type="button"
                            className="modal-close-btn"
                            onClick={onClose}
                        >
                            ×
                        </button>
                    </div>

                    {/* Toolbar */}
                    <div className="modal-toolbar">
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="btn-secondary"
                        >
                            {t("search")}
                        </button>
                    </div>

                    {/* Table */}
                    <div className="modal-body">
                        <table className="co-borrower-table">
                            <thead>
                                <tr>
                                    <th>{t("coBorrowerId")}</th>
                                    <th>{t("coBorrowerName")}</th>
                                    <th>{t("joinDate")}</th>
                                    <th>{t("isOperated")}</th>
                                    <th>{t("priority")}</th>
                                    <th>{t("delete")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {coBorrowers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>
                                            No co-borrowers added
                                        </td>
                                    </tr>
                                )}

                                {coBorrowers.map(cb => (
                                    <tr key={cb.customerId}>
                                        <td>{cb.customerId}</td>
                                        <td className={isMarathi ? "shivaji-font" : ""}>
                                            {cb.name}
                                        </td>
                                        <td>{cb.joinDate}</td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <button
                                                className="btn-link danger"
                                                onClick={() => handleDelete(cb.customerId)}
                                            >
                                                ✖
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer left-align">
                        <button
                            type="button"
                            onClick={handleOk}
                            className="btn-action"
                        >
                            {t("ok")}
                        </button>
                    </div>

                </div>
            </div>

            {/* Customer Search Modal */}
            {isCustomerSearchOpen && (
                <CustomerSearchModal
                    t={t}
                    isMarathi={isMarathi}
                    onClose={() => setIsCustomerSearchOpen(false)}
                    onSelect={handleCustomerSelect}
                />
            )}
        </>
    );
};

export default CoBorrowerModal;
