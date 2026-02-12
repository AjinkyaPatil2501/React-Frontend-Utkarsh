import React, { useState } from 'react';
import "../../ComponentCss/LoanMaster.css";
const FindLedgerModal = ({ t, isMarathi, onClose, onSelect, gldetails, }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredLedgers = gldetails.filter(l =>
        l.glname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.glcode.includes(searchTerm) ||
        l.shortcode.includes(searchTerm)
    );

   return (
    <div className="modal-overlay">
        <div className="modal-content ledger-modal">

            {/* Header */}
            <div className="modal-header">
                <h3 className={isMarathi ? "shivaji-font" : ""}>
                    {t("findGeneralLedger")}
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
            <div className="modal-search">
                <input
                    type="text"
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                />
            </div>

            {/* Table */}
            <div className="modal-table-wrapper">
                <table className="ledger-table">
                    <thead>
                        <tr>
                            <th>{t("glCode")}</th>
                            <th>{t("shortCode")}</th>
                            <th>{t("ledgerName")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLedgers.map((ledger, index) => (
                            <tr
                                key={index}
                                className="ledger-row"
                                onClick={() => onSelect(ledger)}
                            >
                                <td>{ledger.glcode}</td>
                                <td>{ledger.shortcode}</td>
                                <td>{ledger.glname}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    </div>
);

};

export default FindLedgerModal;
