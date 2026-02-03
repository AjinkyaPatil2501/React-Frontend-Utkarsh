import { useSelector, useDispatch } from "react-redux";
import { logout } from "../SessionManagement/authSlice";
import { useNavigate, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../ComponentCss/Navbar.css";
import { useEffect, useRef , useState} from "react";

// const INACTIVITY_TIME=0.5*60*1000;
const INACTIVITY_TIME=300*60*1000;


const Navbar = () => {
  const { user } = useSelector((u) => u.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const { i18n, t } = useTranslation();
      const isMarathi = i18n.language === "mr";
      const isTimeOutRef = useRef(null);
      const timerRef = useRef(null);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const handleLogout = async () => {
    try {
      await fetch("https://utkarsh-core-banking.onrender.com/auth/v1/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error(err);
    }
    dispatch(logout());
    navigate("/");
  };
 
  // -------------------------
  // Automatic session timeout
  // -------------------------

  const resetTimer = ()=>{
    if(isTimeOutRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(()=>{
      isTimeOutRef.current = true;
      // alert(t("sessionTimeOut"));
      // handleLogout();
       setShowTimeoutModal(true);
    },INACTIVITY_TIME)
  };

  useEffect(()=>{
    const events = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event)=>window.addEventListener(event,resetTimer));
    resetTimer();
    return()=>{
      clearTimeout(timerRef.current);
      events.forEach((event)=>window.addEventListener(event,resetTimer));
    };
  },[resetTimer]);
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
        <div className="container-fluid">
          <div className="navbar-nav me-auto">
            <span className="nav-link active">{t("operation")}</span>

            <div className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                {t("master")}
              </span>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/customer-master")}>
                    {t("customerMaster")}
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => navigate("/deposit-master")}>
                    {t("depositMaster")}
                  </button>
                </li>
              </ul>
            </div>

            <div className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                {t("systemTools")}
              </span>
              <ul className="dropdown-menu">
                <li className="dropdown-submenu">
                  <button className="dropdown-item dropdown-toggle">{t("user")}</button>
                  <ul className="dropdown-menu">
                    <li>
                      <button className="dropdown-item" onClick={() => navigate("/add-user")} disabled={localStorage.getItem("role").toUpperCase()!=="A" && localStorage.getItem("role").toUpperCase()!=="O"} >
                        {t("addUser")}
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                {t("controls")}
              </span>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    {t("logout")}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-white fw-bold">
            <label className={isMarathi ? "shivaji-font" : ""}>{t("hello")} , {user?.userName}</label>
            
          </div>
        </div>
      </nav>

    {/* Modern Session Timeout Modal */}
      {showTimeoutModal && (
        <div className="timeout-modal-overlay">
          <div className="timeout-modal">
            <h4>{t("sessionTimeout")}</h4>
            <p>{t("pleaseLoginAgain")}</p>
            <button className="btn btn-danger" onClick={handleLogout}>
              {t("login")}
            </button>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
};
export default Navbar;
