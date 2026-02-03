//============== Adding the update functionality ==================================

import React, { useState, useEffect, useRef } from "react";
import "../../ComponentCss/UserRegister.css";
import UserSearch from "./UserSearch";
import { useValidation } from "../../hooks/useValidation";
import { userRegisterSchema } from "../../validation/schemas";
import { useTranslation } from "react-i18next";
import { allowNumberOnly, allowTextOnly } from "../../validation/validator";

const initialUser = {
  photo: null,
  bankName: "",
  branchName: "",
  userNumber: "",
  shortName: "",
  designation: "",
  userName: "",
  mobile: "",
  debitLimit: "",
  cashier: "No",
  teller: "No",
  password: "",
  fromDate: "",
  toDate: "",
  fromTime: "",
  toTime: "",
  allowExtraTime: false,
};

const ADMIN_SECRET = "admin123";

const UserRegister = () => {
  const [user, setUser] = useState(initialUser);
  const [step, setStep] = useState("locked"); // locked | admin | form
  const [adminPassword, setAdminPassword] = useState("");
  const [banks, setBanks] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [touched, setTouched] = useState({}); // tracks which fields user interacted with
  const [selectedUserId, setSelectedUserId] = useState(null); // track user for update
  const { i18n, t } = useTranslation();
  const isMarathi = i18n.language === "mr";
  const { errors, validate, isValid } = useValidation(userRegisterSchema(t));
  const adminInputRef = useRef(null);

  // Fetch banks on mount
  useEffect(() => {
    fetch("https://utkarsh-core-banking.onrender.com/bank/v1/banks")
      .then(res => res.json())
      .then(data => setBanks(data))
      .catch(err => console.error("Error fetching banks", err));
  }, []);

  // Fetch branches when bank changes
  useEffect(() => {
    if (user.bankName) {
      fetch(`https://utkarsh-core-banking.onrender.com/bank/v1/${user.bankName}`)
        .then(res => res.json())
        .then(data => setBranches(data))
        .catch(err => console.error("Error fetching branches", err));
    } else {
      setBranches([]);
    }
  }, [user.bankName]);

  // Generic form update
  const update = (field, value) => {
    const updatedUser = { ...user, [field]: value };
    setUser(updatedUser);
    setTouched(prev => ({ ...prev, [field]: true }));

    if (step === "form") validate(updatedUser);
  };

  // Admin password check
  const checkAdminPassword = () => {
    if (adminPassword === ADMIN_SECRET) {
      setStep("form");
    } else {
      alert("Invalid administrative password");
    }
  };

 
  // Focus the admin password input whenever step becomes "admin"
  useEffect(() => {
    if (step === "admin" && adminInputRef.current) {
      adminInputRef.current.focus();
    }
  }, [step]);

  // Reset form for new user
  const handleNew = () => {
    setUser(initialUser);
    setTouched({});
    setSelectedUserId(null);
    setStep("admin");
    setAdminPassword("");
    setStep("admin"); // enable admin step
  };

  // Close form
  const handleExit = () => (window.location.href = "/navbar");

  // ================= SUBMIT NEW USER =================
  const handleSubmit = async () => {
    const validationErrors = validate(user);

    if (user.fromDate && user.toDate && new Date(user.toDate) < new Date(user.fromDate)) {
      alert("To Date must be after From Date");
      return;
    }

    if (!isValid(validationErrors)) {
      const allTouched = Object.keys(user).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
      alert("Please fix validation errors");
      return;
    }

    try {
      const response = await fetch("https://utkarsh-core-banking.onrender.com/users/v1/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cbankId: user.bankName,
          cbranId: user.branchName,
          cuserId: user.userNumber,
          cuserName: user.userName,
          cuserInit: user.shortName,
          nuserDrC: user.debitLimit,
          ccashier: user.cashier === "Yes" ? "Y" : "N",
          cteller: user.teller === "Yes" ? "Y" : "N",
          cpassword: user.password,
          mobno: user.mobile,
          frDate: user.fromDate,
          toDate: user.toDate,
          frTime: user.fromTime,
          toTime: user.toTime,
          etime: user.allowExtraTime ? "Y" : "N",
          photo: user.photo,
        }),
      });

      if (response.ok) {
        alert(await response.text());
        handleNew();
      } else {
        alert("Server error during registration");
      }
    } catch (err) {
      console.error(err);
      alert("Network error during registration");
    }
  };

  // ================= UPDATE EXISTING USER =================
  const handleUpdate = async () => {
    if (!selectedUserId) return;

    const validationErrors = validate(user);

    if (!isValid(validationErrors)) {
      const allTouched = Object.keys(user).reduce((acc, key) => ({ ...acc, [key]: true }), {});
      setTouched(allTouched);
      alert("Please fix validation errors before updating");
      return;
    }

    try {
      const response = await fetch(`https://utkarsh-core-banking.onrender.com/users/v1/update`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cbankId: user.bankName,
          cbranId: user.branchName,
          cuserId: user.userNumber,
          cuserName: user.userName,
          cuserInit: user.shortName,
          nuserDrC: user.debitLimit,
          ccashier: user.cashier === "Yes" ? "Y" : "N",
          cteller: user.teller === "Yes" ? "Y" : "N",
          cpassword: user.password,
          mobno: user.mobile,
          frDate: user.fromDate,
          toDate: user.toDate,
          frTime: user.fromTime,
          toTime: user.toTime,
          etime: user.allowExtraTime ? "Y" : "N",
          photo: user.photo,
        }),
      });

      if (response.ok) {
        alert("User updated successfully");
        setSelectedUserId(null);
        handleNew(); // reset form after update
      } else {
        const errorMsg = await response.text();
        alert(`Update failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error(err);
      alert("Network error during update");
    }
  };

  // ================= SEARCH USER SCREEN =================
  if (showSearch) {
    return (
      <UserSearch
        onBack={() => setShowSearch(false)}
        onUserSelect={(u) => {
          // console.log("select user data : ", u);
          setUser({
            ...initialUser,
            bankName: u.cbankId || "",
            branchName: u.cbranId || "",
            userNumber: u.cuserId || "",
            shortName: u.cuserInit || "",
            // designation: u.cuserStat || "",
            designation: u.cuserStat ? u.cuserStat.toUpperCase() : "",
            userName: u.cuserName || "",
            mobile: u.mobno || "",
            debitLimit: u.nuserDrC || "",
            cashier: u.ccashier === "Y" ? "Yes" : "No",
            teller: u.cteller === "Y" ? "Yes" : "No",
            password: u.cpassword,
            fromDate: u.frDate || "",
            toDate: u.toDate || "",
            fromTime: u.frTime || "",
            toTime: u.toTime || "",
            allowExtraTime: u.etime === "Y",
            // photo: u.photo ? `data:image/jpeg;base64,${u.photo}` : null,
            photo: u.photo || null,
          });
          setSelectedUserId(u.cuserId); // track selected user for update
          setStep("form");
          setShowSearch(false);
          setTouched({});
        }}
      />
    );
  }

  // ================= MAIN FORM =================

  return (
    <div className="user-master-wrapper">
      <h2>
        {selectedUserId
          ? `${t("editUser")} : ${selectedUserId}`
          : t("addNewUser")}
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          selectedUserId ? handleUpdate() : handleSubmit();
        }}
      >
        {step === "admin" && (
          <div className="form-row">
            <label>
              {t("adminPassword")}:
              <input
                type="password"
                ref={adminInputRef}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </label>
            <button type="button" onClick={checkAdminPassword}>
              {t("confirm")}
            </button>
          </div>
        )}

        {step === "form" && (
          <>
            {/* Photo Upload Section */}
            <div className="form-row">
              <div className="photo-upload-section">
                <div
                  className="photo-box"
                  onClick={() => document.getElementById("photoInput").click()}
                >
                  {user.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${user.photo}`}
                      alt="Passport"
                      className="photo-preview"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(t("downloadPhotoConfirm"))) {
                          const link = document.createElement("a");
                          link.href = user.photo;
                          link.download = "passport_photo.jpg";
                          link.click();
                        }
                      }}
                    />
                  ) : (
                    <span className="photo-placeholder">{t("photo")}</span>
                  )}
                </div>

                <input
                  type="file"
                  id="photoInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = reader.result;
                        if (typeof result === "string" && result.includes(",")) {
                          const base64Only = result.substring(result.indexOf(",") + 1);
                          update("photo", base64Only);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                <button
                  type="button"
                  className="photo-button"
                  onClick={() => document.getElementById("photoInput").click()}
                >
                  {t("photo")} <span className="required">*</span>
                </button>
              </div>
            </div>

            {/* Bank and Branch Selection */}
            <div className="form-row">
              <label>
                {t("bankName")}:
                <select
                  value={user.bankName}
                  onChange={(e) => update("bankName", e.target.value)}
                  className={isMarathi ? "shivaji-font" : ""}
                >
                  <option value="">{t("selectBank")}</option>
                  {banks.map((b) => (
                    <option key={b.cbankCode} value={b.cbankCode}>
                      {b.cbankName}
                    </option>
                  ))}
                </select>
                {errors.bankName && touched.bankName && (
                  <span className="error">{t(errors.bankName)}</span>
                )}
              </label>

              <label>
                {t("branchName")}:
                <select
                  value={user.branchName}
                  onChange={(e) => update("branchName", e.target.value)}
                  disabled={!user.bankName}
                  className={isMarathi ? "shivaji-font" : ""}
                >
                  <option value="">{t("selectBranch")}</option>
                  {branches.map((br) => (
                    <option key={br.cbranCode} value={br.cbranCode}>
                      {br.cbranName}
                    </option>
                  ))}
                </select>
                {errors.branchName && touched.branchName && (
                  <span className="error">{t(errors.branchName)}</span>
                )}
              </label>
            </div>

            <div className="form-row">
              <label>
                {t("userNumber")}:
                <input value={user.userNumber} disabled />
              </label>

              <label>
                {t("shortName")}:
                <input
                  value={user.shortName}
                  onKeyDown={(e) => allowTextOnly(e,isMarathi)}
                  onChange={(e) => {
                    // Only allow up to 2 characters
                    if (e.target.value.length <= 2) {
                      update("shortName", e.target.value.toUpperCase());
                    }
                  }}
                />
                {
                  errors.shortName && touched.shortName && (
                    <span className="error">{t(errors.shortName)}</span>
                  )
                }
              </label>
            </div>

            <div className="form-row">
              <label>
                {t("designation")}:
                <select
                  value={user.designation}
                  onChange={(e) => update("designation", e.target.value)}
                >
                  <option value="">{t("select")}</option>
                  <option value="A">SuperUser</option>
                  <option value="L">Clerk</option>
                  <option value="M">Manager</option>
                  <option value="C">Cashier</option>
                  <option value="O">Officer</option>
                </select>
                {errors.designation && touched.designation && (
                  <span className="error">{t(errors.designation)}</span>
                )}
              </label>

              <label>
                {t("userName")}:
                <input
                  value={user.userName}
                  className={isMarathi ? "shivaji-font" : ""}
                  onKeyDown={(e) => allowTextOnly(e,isMarathi)}
                  onChange={(e) => update("userName", e.target.value)}
                />
                {errors.userName && touched.userName && (
                  <span className="error">{t(errors.userName)}</span>
                )}
              </label>
            </div>

            <div className="form-row">
              <label>
                {t("mobile")}:
                <input
                  className={isMarathi ? "shivaji-font" : ""}
                  value={user.mobile}
                  onKeyDown={allowNumberOnly}
                  onChange={(e) => { if (e.target.value.length < 11) { update("mobile", e.target.value) } }}
                />
                {errors.mobile && touched.mobile && (
                  <span className="error">{t(errors.mobile)}</span>
                )}
              </label>

              <label>
                {t("debitLimit")}:
                <input
                  className={isMarathi ? "shivaji-font" : ""}
                  value={user.debitLimit}
                  onKeyDown={allowNumberOnly}
                  onChange={(e) => { if (e.target.value.length < 9) { update("debitLimit", e.target.value) } }}
                  placeholder="0.00"
                />
                {errors.debitLimit && touched.debitLimit && (
                  <span className="error">{t(errors.debitLimit)}</span>
                )}
              </label>
            </div>

            <div className="form-row">
              <label>
                {t("cashier")}:
                <select
                  value={user.cashier}
                  onChange={(e) => update("cashier", e.target.value)}
                >
                  <option value="Yes">{t("yes")}</option>
                  <option value="No">{t("no")}</option>
                </select>
                {errors.cashier && touched.cashier && (
                  <span className="error">{t(errors.cashier)}</span>
                )}
              </label>

              <label>
                {t("teller")}:
                <select
                  value={user.teller}
                  onChange={(e) => update("teller", e.target.value)}
                >
                  <option value="Yes">{t("yes")}</option>
                  <option value="No">{t("no")}</option>
                </select>
                {errors.teller && touched.teller && (
                  <span className="error">{t(errors.teller)}</span>
                )}
              </label>
            </div>

            <div className="form-row">
              <label>
                {t("passwordField")}:
                <input
                  type="password"
                  value={user.password}
                  onChange={(e) => update("password", e.target.value)}
                />
                {errors.password && touched.password && (
                  <span className="error">{t(errors.password)}</span>
                )}
              </label>

              <label>
                {t("fromDate")}:
                <input
                  // className={isMarathi ? "shivaji-font" : ""}
                  type="date"
                  value={user.fromDate}
                  onChange={(e) => update("fromDate", e.target.value)}
                />
                {errors.fromDate && touched.fromDate && (
                  <span className="error">{t(errors.fromDate)}</span>
                )}
              </label>
            </div>

            <div className="form-row">
              <label>
                {t("toDate")}:
                <input
                  type="date"
                  value={user.toDate}
                  onChange={(e) => update("toDate", e.target.value)}
                />
                {errors.toDate && touched.toDate && (
                  <span className="error">{t(errors.toDate)}</span>
                )}
              </label>

              <label>
                {t("fromTime")}:
                <input
                  type="time"
                  value={user.fromTime}
                  onChange={(e) => update("fromTime", e.target.value)}
                />
                {errors.fromTime && touched.fromTime && (
                  <span className="error">{t(errors.fromTime)}</span>
                )}
              </label>
            </div>

            <div className="form-row">
              <label>
                {t("toTime")}:
                <input
                  type="time"
                  value={user.toTime}
                  onChange={(e) => update("toTime", e.target.value)}
                />
                {errors.toTime && touched.toTime && (
                  <span className="error">{t(errors.toTime)}</span>
                )}
              </label>

              <label className="checkbox-row">
                <span>{t("allowExtraTime")}: </span>
                <input
                  type="checkbox"
                  checked={user.allowExtraTime}
                  className="allowExtraTime"
                  onChange={(e) => update("allowExtraTime", e.target.checked)}
                />
   
              </label>
            </div>
          </>
        )}

        <div className="bottom-actions">
          <button type="button" onClick={handleNew}>
            {t("new")}
          </button>
          <button type="button" onClick={() => setShowSearch(true)}>
            {t("search")}
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={step !== "form" || !!selectedUserId}
          >
            {t("submit")}
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!selectedUserId}
          >
            {t("update")}
          </button>
          {/* <button type="button">{t("delete")}</button> */}
          <button type="button" onClick={handleExit}>
            {t("close")}
          </button>
        </div>
      </form>
    </div>
  );
};
export default UserRegister;