import { useTranslation } from "react-i18next";
import "../../ComponentCss/DepositMasterForm.css";

const DepositTab = ({ data, onChange }) => {
    const { i18n, t } = useTranslation();
    const isMarathi = i18n.language === "mr";

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    return (
        <div className="tab-panel">
            <div className="personal-info-form">
                {/* Row 1: Thev Pavti Kramank + Vyaj Kadhayache Ka */}
                <div className="form-row multi-field-row">
                    <div className="field-group">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            {t("thevPavtiKramank")}
                        </label>
                        <input
                            type="text"
                            name="depositReceiptNo"
                            value={data.depositReceiptNo}
                            onChange={handleChange}
                            className="medium-input"
                        />
                    </div>
                    <div className="field-group">
                        <label className={isMarathi ? "shivaji-font" : ""}>
                            {t("vyajKadhayacheKa")}
                        </label>
                        <select
                            name="deductInterest"
                            value={data.deductInterest}
                            onChange={handleChange}
                            className="small-select"
                        >
                            <option value="Y">Y</option>
                            <option value="N">N</option>
                        </select>
                    </div>
                </div>

                {/* Row 2: Chapai Keli */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("chapaiKeli")}
                    </label>
                    <input
                        type="text"
                        name="isPrinted"
                        value={data.isPrinted}
                        onChange={handleChange}
                        className="small-input"
                        disabled
                        // placeholder="N"
                    />
                </div>
            </div>
        </div>
    );
};

export default DepositTab;