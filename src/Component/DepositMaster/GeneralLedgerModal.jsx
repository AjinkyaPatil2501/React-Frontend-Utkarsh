import { useState, useRef, useEffect } from "react";

const GeneralLedgerModal = ({ data, requiredDetails, handleChange, t, isMarathi }) => {
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [filteredLedgers, setFilteredLedgers] = useState([]);
    const searchInputRef = useRef(null);

    // Example: Replace with your API or local ledger list
    const allLedgers = requiredDetails;

    useEffect(() => {
        if (!searchText) {
            setFilteredLedgers(allLedgers);
        } else {
            setFilteredLedgers(
                allLedgers.filter(
                    (l) =>
                        l.glcode.includes(searchText) ||
                        l.glname.toLowerCase().includes(searchText.toLowerCase()) ||
                        l.shortcode.toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }
    }, [searchText]);

    const handleLedgerSelect = (ledger) => {
        handleChange({ target: { name: "interestLedgerNo", value: ledger.glcode } });
        handleChange({ target: { name: "interestLedgerName", value: ledger.glname } });
        setShowModal(false);
    };

    return (
        <div className="input-group" style={{ position: "relative" }}>
            <input
                type="text"
                name="interestLedgerNo"
                value={data.interestLedgerNo || ""}
                placeholder={t("selectGL")}
                onFocus={() => setShowModal(true)}
                // readOnly
                className="small-input"
            />

            <input
                type="text"
                name="interestLedgerName"
                value={data.interestLedgerName || ""}
                // readOnly
                className={`form-input ${isMarathi ? "shivaji-font" : ""}`}
            />

            {showModal && (
                <div className="ledger-modal">
                    <div className="ledger-modal-content">
                        {/* HEADER */}
                        <div className="ledger-modal-header">
                            <h3 className={isMarathi ? "shivaji-font" : ""}>{t("searchgl")}</h3>
                        </div>

                        {/* SEARCH BOX */}
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={t("search")}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="ledger-search-box"
                        />

                        {/* TABLE */}
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
                                    {filteredLedgers.length ? (
                                        filteredLedgers.map((ledger) => (
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
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} style={{ textAlign: "center" }}>
                                                {t("noRecordFound")}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* FOOTER */}
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
    );
};

export default GeneralLedgerModal;
