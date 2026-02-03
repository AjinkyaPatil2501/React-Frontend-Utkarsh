import { useTranslation } from "react-i18next";
import { useEffect , useState} from "react";
import "../../ComponentCss/DepositMasterForm.css";
import { validateCustomer } from "../../validation/validator";
import { savingsCurrentTabSchema } from "../../validation/schemas";


const SavingsCurrentTab = ({ data, onChange }) => {
    const { i18n, t } = useTranslation();
    const isMarathi = i18n.language === "mr";

    // Add validation state
    const [errors, setErrors] = useState({});

    // Add validation function
    const handleBlur = (field) => {
        const schema = savingsCurrentTabSchema(t);
        const fieldSchema = { [field]: schema[field] };
        const fieldErrors = validateCustomer(data, fieldSchema);
        setErrors(prev => ({ ...prev, ...fieldErrors }));
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };


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
                    name: "savingsOpeningDate",
                    value: startDate || ""
                }
            });
        } catch (err) {
            console.error("Error fetching member number:", err);
        }
    }
    useEffect(() => {
        if (data.savingsAmount) {
            fetchSavingsAmount();
        }
    }, [data.savingsAmount])
    const fetchSavingsAmount = async () => {
        try {
            const response = await fetch(`https://utkarsh-core-banking.onrender.com/deposite/v1/savingsrate?glCode=${data.ledgerNo}&depositAmount=${data.savingsAmount}`)
            const interest = await response.text();;
            // console.log("da = " + data.depositAmount + " " + " for gl = " + data.ledgerNo + " " + " for frequency= " + data.interestPeriodMonths + " " + "interest is=" + interest)

            handleChange({
                target: {
                    name: "savingsInterestRate",
                    value: interest || ""
                }
            });
        } catch (error) {
            console.error("Error fetching interest rate:", error);
        }
    }
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
                        name="savingsOpeningDate"
                        value={data.savingsOpeningDate}
                        onChange={handleChange}
                        className="half-width-input"
                    />
                </div>

                {/* Thevnichi Rakkam (Deposit Amount) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        <span>{t("thevnichiRakkam")} <span style={{ color: 'red' }}>*</span></span>
                    </label>
                    <div style={{flex:1}}>
                    <input
                        type="number"
                        name="savingsAmount"
                        value={data.savingsAmount || ""}
                        onChange={handleChange}
                         onBlur={() => handleBlur('savingsAmount')}
                        min={0}
                        className="amount-field half-width-input"
                        style={errors.savingsAmount ? { borderColor: 'red' } : {}}

                    />
                     {errors.savingsAmount && (
                            <span style={{ color: 'red', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                                {errors.savingsAmount}
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
                        type="number"
                        name="savingsInterestRate"
                        value={data.savingsInterestRate}
                        onChange={handleChange}
                        className="amount-field half-width-input"
                        readOnly
                    />
                </div>

                {/* Tatpurte Karj (Temporary Loan) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("tatpurteKarj")}
                    </label>
                    <select
                        name="isTemporaryLoan"
                        value={data.isTemporaryLoan}
                        onChange={handleChange}
                        className="small-select"
                    >
                        <option value="">{t("select")}</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                {/* Tatpurte Karj Maryada (Temp Loan Limit) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("tatpurteKarjMaryada")}
                    </label>
                    <input
                        type="number"
                        name="tempLoanLimit"
                        value={data.tempLoanLimit}
                        onChange={handleChange}
                        className="amount-field half-width-input"
                        min={0}
                    />
                </div>

                {/* Tatpurte Karj Vyaj (Temp Loan Interest) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("tatpurteKarjVyaj")}
                    </label>
                    <input
                        type="number"
                        name="tempLoanInterestRate"
                        value={data.tempLoanInterestRate}
                        onChange={handleChange}
                        min={0}
                        className="amount-field half-width-input"
                    />
                </div>

                {/* Tatpurte Karj Antim Dinak (Temp Loan End Date) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("tatpurteKarjAntimDinak")}
                    </label>
                    <input
                        type="date"
                        name="tempLoanEndDate"
                        value={data.tempLoanEndDate}
                        onChange={handleChange}
                        className="half-width-input"
                    />
                </div>

                {/* Vasuli Karaychi Ka (Deduct Recovery?) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("vasuliKaraychiKa")}
                    </label>
                    <select
                        name="isRecovery"
                        value={data.isRecovery}
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

export default SavingsCurrentTab;