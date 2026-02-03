// for jwt errors other wise above code working fine

import  { useState } from 'react';
import '../ComponentCss/Login.css';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../SessionManagement/authSlice';
import { getDeviceId } from '../Utils/deviceId.js';
import { useTranslation } from "react-i18next";
import { allowNumberOnly } from "../validation/validator";

const Login = () => {
  const deviceId = getDeviceId();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setStatusMessage('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      setStatusMessage("❌ Please enter username and password");
      return;
    }

    setIsLoading(true);
    setStatusMessage("🔄 Logging in...");

    try {
      const response = await fetch("https://utkarsh-core-banking.onrender.com/auth/v1/login", {
        method: "POST",
        credentials: "include", // ✅ important to send/receive HttpOnly cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuserId: formData.username,
          cpassword: formData.password,
          deviceId
        }),
      });

      if (response.status === 403) {
        setStatusMessage("❌ Login blocked: This account is locked to another device.");
        return;
      }

      if (response.status === 401) {
        setStatusMessage("❌ Invalid username or password");
        return;
      }

      if (!response.ok) {
        setStatusMessage("❌ Login failed.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("role", data.cuserStat);
      localStorage.setItem("branchId", data.branchId);
      localStorage.setItem("bankId",data.bankId);
      
      if (data?.userId) {
        dispatch(loginSuccess(data));
        // setStatusMessage("✅ Login successful! Redirecting...");
        setStatusMessage(t("loginSuccess"));

        setTimeout(() => navigate("/navbar"), 500);
      }

    } catch (error) {
      console.error(error);
      setStatusMessage(t("serverError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ username: "", password: "" });
    setStatusMessage("");
  };

  return (
    <main className="login-container">
      <header className="login-header">
        <h1 className="login-title">{t("loginTitle")}</h1>
        <p className="login-subtitle">{t("loginSubtitle")}</p>
        <p className="login-society">{t("loginSociety")}</p>
      </header>

      <section className="login-card">
        {statusMessage && <div className="status-message">{statusMessage}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">{t("username")}</label>
            <input
              className="form-input"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              onKeyDown={e=>allowNumberOnly(e)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t("password")}</label>
            <input
              type="password"
              className="form-input"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>

          <div className="button-row">
            <button type="submit" className="btn btn-login" disabled={isLoading}>
              {isLoading ? t("loggingIn") : t("login")}
            </button>

            <button type="button" className="btn btn-cancel" onClick={handleCancel} disabled={isLoading}>
              {t("cancel")}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;