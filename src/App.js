import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route } from 'react-router-dom';

import Login from './Component/Login';
import Navbar from './Component/Navbar';
import CustomerOnboardingForm from './Component/CustomerMaster/CustomerOnboardingForm';
import ProtectedRoute from './Component/ProtectedRoute';
import DepositMasterForm from "./Component/DepositMaster/DepositMasterForm";

import { loginSuccess, authChecked } from "./SessionManagement/authSlice";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UserRegister from "./Component/UserMaster/UserRegister";
import i18n from "./i18n";

const App = () => {
  const dispatch = useDispatch();
  const authLoaded = useSelector((state) => state.auth.authLoaded);

  // 🔁 Restore session on page refresh
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("https://utkarsh-core-banking.onrender.com/auth/v1/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(loginSuccess(data));
          // console.log("app me :",data);
        } else {
          dispatch(authChecked());
        }
      } catch {
        dispatch(authChecked());
      }
    };
    loadUser();
  }, [dispatch]);

  // For Fetching The Lang

  useEffect(() => {
    const fetchLang = async () => {
      try {
        const res = await fetch("https://utkarsh-core-banking.onrender.com/auth/v1/lang", { credentials: "include" });
        if (res.ok) {
          const lang = await res.text(); // backend returns plain string
          if (lang) {
            const mappedLang = lang.trim().toUpperCase() === "M" ? "mr" : "en";
            i18n.changeLanguage(mappedLang);
          }
        }
      } catch (err) {
        console.error("Failed to fetch language:", err);
      }
    };
    fetchLang();
  }, []);

  //  Block UI until auth check finishes
  if (!authLoaded) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Login />} />

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute><Navbar /></ProtectedRoute>}>
        <Route path="/navbar" element={<div />} />
<Route path="/deposit-master" element={<DepositMasterForm />} />
        <Route path="/customer-master" element={<CustomerOnboardingForm />} />
        <Route path="/add-user" element={<UserRegister />} />
      </Route>

      {/* Optional unauthorized page */}
      <Route path="/unauthorized" element={<div>Access Denied</div>} />
    </Routes>
  );
};

export default App;
