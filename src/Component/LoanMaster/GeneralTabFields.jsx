
import "../../ComponentCss/LoanMaster.css";
const GeneralTabFields = ({
    t,
    isMarathi,
    data = {},
    onChange,
    setIsLedgerModalOpen,
    setIsCoBorrowerModalOpen,
    firstFieldRef,
    formEnabled,
    setIsCustomerSearchModalOpen,
    directors
}) => {

    // ✅ FIX: pass event directly
    const handleChange = (e) => {
        onChange(e);
    };

    return (
        <>
            {/* Ledger No */}
            <div className="form-row">
                <label className={isMarathi ? "shivaji-font" : ""}>
                    <span className="label-inline">
                        {t("khatavniKramank")} <span className="required-asterisk">*</span>
                    </span>
                </label>
                <div className="split-row">
                    <input
                        ref={firstFieldRef}
                        type="text"
                        name="ledgerNo"
                        value={data.ledgerNo || ""}
                        onClick={() => setIsLedgerModalOpen(true)}
                        className="form-control"
                        style={{ cursor: 'pointer', backgroundColor: 'white' }}
                    />
                    <input
                        name="ledgerType"
                        value={data.ledgerType || ""}
                        onChange={handleChange}
                        className="form-select"
                        disabled
                    />
                </div>
            </div>

            {/* Account No */}
            <div className="form-row">
                <label className={isMarathi ? "shivaji-font" : ""}>
                    <span className="label-inline">
                        {t("khateKramank")} <span className="required-asterisk">*</span>
                    </span>
                </label>
                <input
                    type="text"
                    name="accountNumber"
                    value={data.accountNumber || ""}
                    disabled
                    className="always-disabled-field"
                />
            </div>

            {/* Customer No */}
            <div className="form-row">
                <label className={isMarathi ? "shivaji-font" : ""}>
                    <span className="label-inline">
                        {t("grahakKramank")} <span className="required-asterisk">*</span>
                    </span>
                </label>
                <div className="split-row">
                    <input
                        type="text"
                        name="customerNumber"
                        value={data.customerNumber || ""}
                        onChange={handleChange}
                        onClick={() => setIsCustomerSearchModalOpen(true)}
                    />
                    <input
                        name="customerName"
                        value={data.customerName || ""}
                        onChange={handleChange}
                        disabled
                    />
                </div>
            </div>

            {/* Director */}
            <div className="form-row">
                <label className={isMarathi ? "shivaji-font" : ""}>
                    {t("sanchalakKramank")}
                </label>
                <div className="split-row">
                    <input
                        name="directorNo"
                        value={data.directorNo || ""}
                        onChange={handleChange}
                        className="form-select"
                        disabled
                    />
                    <select
                        name="directorName"
                        value={data.directorName || ""}
                        onChange={(e) => {
                            const selectedName = e.target.value;

                            const selectedDirector = directors?.find(
                                d => d.directorName === selectedName
                            );

                            onChange({
                                directorName: selectedName,
                                directorNo: selectedDirector
                                    ? selectedDirector.directorCode
                                    : ""
                            });
                        }}
                        className="form-select"
                    >
                        <option value="">{t("select")}</option>

                        {directors?.map((d, index) => (
                            <option key={index} value={d.directorName}>
                                {d.directorName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Member No */}
            <div className="form-row">
                <label className={isMarathi ? "shivaji-font" : ""}>
                    {t("sabhasadNumber")}
                </label>
                <div className="input-group">
                    <input
                        name="memberNo"
                        value={data.memberNo || ""}
                        onChange={handleChange}
                        className="form-select"
                        disabled
                    />
                </div>
            </div>

            {/* Loan Type */}
            <div className="form-row">
                <label className={isMarathi ? "shivaji-font" : ""}>
                    {t("prakar")}
                </label>
                <select
                    name="loanType"
                    value={data.loanType || ""}
                    onChange={handleChange}
                    className="form-select"
                >
                    <option value="">Select</option>
                    <option value="">Staff</option>
                    <option value="">General</option>
                    <option value="">Society</option>
                </select>
            </div>

            {/* Co-Borrower */}
            <div className="form-row">
                <label className={isMarathi ? "shivaji-font" : ""}>
                    {t("coBorrower")}
                </label>
                <button
                    type="button"
                    className="info-btn"
                    onClick={() => setIsCoBorrowerModalOpen(true)}
                >
                    {t("addCoBorrowerDetails")}
                </button>
            </div>
        </>
    );
};

export default GeneralTabFields;
