import { useTranslation } from "react-i18next";
import "../../ComponentCss/DepositMasterForm.css";
import { useEffect, useState, useRef } from "react";
import { allowTextOnly, allowNumberOnly } from "../../validation/validator";
import CustomerSearchModal from "./CustomerSearchModal";
const PersonalInfoTab = ({ data, onChange }) => {
    const { i18n, t } = useTranslation();
    const isMarathi = i18n.language === "mr";
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    const addressRef = useRef(null);
    const cityRef = useRef(null);
    const phoneRef = useRef(null);
    const specialInstructionRef = useRef(null);
    const nomineeNameRef = useRef(null);
    const introducerNameRef = useRef(null);
    const introducerAddressRef = useRef(null);
    const introducerCityRef = useRef(null);
    const checkBookRef = useRef(null);
    const form15HRef = useRef(null);
    const smsServiceRef = useRef(null);

    useEffect(() => {
        if (data.customerNumber) {
            fetchAddressDetails();
        }
    }, [data.customerNumber]);

     useEffect(() => {
        addressRef.current?.focus();
    }, []);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if(showCustomerModal)
            {
                return;
            }
            nextRef?.current?.focus();
        }
    };

    const fetchAddressDetails = async () => {
        try {
            const response = await fetch(`https://utkarsh-core-banking.onrender.com/deposite/v1/address?customerId=${data.customerNumber}`)
            if (!response.ok) {
                throw new Error("Failed to fetch member number");
            }

            // 🔴 BACKEND RETURNS STRING, NOT JSON
            const addressData = await response.json();
            console.log(addressData)
            handleChange({ target: { name: "address", value: addressData.address || "" } });
            handleChange({ target: { name: "city", value: addressData.city || "" } });
            handleChange({ target: { name: "phone", value: addressData.phone || "" } });
            handleChange({ target: { name: "specialInstruction", value: addressData.specialInstruction || "" } });
            handleChange({ target: { name: "nomineeName", value: addressData.nomineeName || "" } });
            handleChange({ target: { name: "introducerName", value: addressData.introducerName || "" } });
            handleChange({ target: { name: "introducerAddress", value: addressData.introducerAddress || "" } });
            handleChange({ target: { name: "introducerCity", value: addressData.introducerCity || "" } });
            handleChange({ target: { name: "checkBook", value: addressData.checkBook || "" } });
            handleChange({ target: { name: "form15H", value: addressData.form15H || "" } });
            handleChange({ target: { name: "smsService", value: addressData.smsService || "" } });
        } catch (error) {
            console.error("Error fetching address details:", error);
        }
    }
    return (
        <div className="tab-panel">
            <div className="personal-info-form">
                {/* Patta (Address) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("patta")}
                    </label>
                    <textarea
                         ref={addressRef}
                        name="address"
                        value={data.address}
                        onChange={handleChange}
                        onKeyDown={(e) => handleKeyDown(e, cityRef)}
                        rows="2"
                        className="form-textarea"
                    />
                </div>

                {/* Shahar (City) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("shahar")}
                    </label>
                    <div className="input-group">
                        <input
                            ref={cityRef}  
                            name="city"
                            value={data.city}
                            onChange={handleChange}
                            onKeyDown={e => { allowTextOnly(e, isMarathi); handleKeyDown(e, phoneRef );}}
                            className={isMarathi ? "shivaji-font" : ""}
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("phone")}
                    </label>
                    <input
                        ref={phoneRef}
                        type="text"
                        name="phone"
                        value={data.phone}
                        onChange={(e) => {
                            if (e.target.value.length <= 10) {
                                handleChange(e);
                            }
                        }}
                        onKeyDown={ (e)=>{allowNumberOnly(e); handleKeyDown(e, specialInstructionRef );}}

                        className="half-width-input"
                        

                    />
                </div>

                {/* Vishesh Shuchna (Special Instruction) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("visheshShuchna")}
                    </label>
                    <input
                        ref={specialInstructionRef}
                        type="text"
                        name="specialInstruction"
                        value={data.specialInstruction}
                        onChange={handleChange}
                        onKeyDown={(e)=>handleKeyDown(e,nomineeNameRef)}
                        className={isMarathi ? "shivaji-font" : ""}
                    />
                </div>

                {/* Varsache Nav (Nominee Name) + Button */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("varsacheNav")}
                    </label>
                    <div className="input-with-button">
                        <input
                            ref={nomineeNameRef}
                            type="text"
                            name="nomineeName"
                            value={data.nomineeName}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault(); // prevent form submission
                                    setShowCustomerModal(true); // open modal
                                }
                            }}
                            className={isMarathi ? "shivaji-font" : ""}
                        />
                        {/* Customer Modal */}
                        {showCustomerModal && (
                            <CustomerSearchModal
                                onClose={() => setShowCustomerModal(false)}
                                onSelect={(customer) => {
                                    const fullName = `${customer.firstName} ${customer.middleName || ""} ${customer.lastName || ""}`.trim();
                                    handleChange({ target: { name: "nomineeName", value: fullName } });
                                    setShowCustomerModal(false);
                                    setTimeout(()=>{
                                        introducerNameRef.current?.focus();
                                    },0);
                                }}
                            />
                        )}
                        {/* <button
                            type="button"
                            className={`info-btn ${isMarathi ? "shivaji-font" : ""}`}
                        >
                            {t("varsachiMahiti")}
                        </button> */}
                    </div>
                </div>

                {/* Introducer Name */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("olakhnaryacheNav")}
                    </label>
                    <input
                        ref={introducerNameRef}
                        type="text"
                        name="introducerName"
                        value={data.introducerName}
                        onChange={handleChange}
                        onKeyDown={(e)=>handleKeyDown(e,introducerAddressRef)}
                        className={isMarathi ? "shivaji-font" : ""}
                    />
                </div>

                {/* Introducer Address */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("olakhnaryachaPatta")}
                    </label>
                    <textarea
                        ref={introducerAddressRef}
                        name="introducerAddress"
                        value={data.introducerAddress}
                        onChange={handleChange}
                        onKeyDown={(e)=>handleKeyDown(e,introducerCityRef)}
                        rows="2"
                        className="form-textarea"
                    />
                </div>

                {/* Introducer City */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("olakhnaryacheGavShahar")}
                    </label>
                    <div className="input-group">
                        <input
                            ref={introducerCityRef}
                            name="introducerCity"
                            value={data.introducerCity}
                            onChange={handleChange}
                            onKeyDown={e => { allowTextOnly(e, isMarathi) ; handleKeyDown(e,checkBookRef);}}
                            className={isMarathi ? "shivaji-font" : ""}
                        />

                    </div>
                </div>

                {/* Check Pustak (Check Book) */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("checkPustak")}
                    </label>
                    <select
                        ref={checkBookRef}
                        name="checkBook"
                        value={data.checkBook}
                        onChange={(e)=>{handleChange(e); setTimeout(()=>{form15HRef.current?.focus()},0)}}
                        className="small-select"
                    >
                        <option value="">{t("select")}</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                {/* Form 15H */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("form15H")}
                    </label>
                    <select
                        ref={form15HRef}
                        name="form15H"
                        value={data.form15H}
                        onChange={(e)=>{handleChange(e);setTimeout(()=>{smsServiceRef.current?.focus()},0)}}
                        className="small-select"
                    >
                        <option value="">{t("select")}</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                {/* SMS */}
                <div className="form-row">
                    <label className={isMarathi ? "shivaji-font" : ""}>
                        {t("sms")}
                    </label>
                    <select
                        ref={smsServiceRef}
                        name="smsService"
                        value={data.smsService}
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

export default PersonalInfoTab;