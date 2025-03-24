import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "../../css/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUserCog, faTachometerAlt, faSignOutAlt,
    faCircle, faBars, faChevronDown, faTruck
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard({ onLogout, logoSrc }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isMasterOpen, setIsMasterOpen] = useState(false);
    const [isOperasionalOpen, setIsOperasionalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();
    const [user, setUser ] = useState(null);

    const mainMenus = [
        { name: "Dashboard", path: "/dashboard", icon: faTachometerAlt }
    ];

    const masterMenus = [
        { name: "Data Departemen", path: "/dashboard/departemen", icon: faCircle },
        { name: "Data Karyawan", path: "/dashboard/karyawan", icon: faCircle },
        { name: "Data User", path: "/dashboard/user", icon: faCircle },
        { name: "Data Akses", path: "/dashboard/akses", icon: faCircle },
    ];

    const operasionalMenus = [
        { name: "Perpanjangan STNK", path: "/dashboard/perpanjangan-stnk", icon: faCircle },
        { name: "KIR", path: "/dashboard/kir", icon: faCircle },
    ];

    // Function to filter menus based on search query
    const filterMenus = (menus) => {
        return searchQuery.trim() === ""
            ? menus // Return all menus if search query is empty
            : menus.filter(menu => menu.name.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleMasterMenu = () => setIsMasterOpen((prev) => !prev);
    const toggleOperasionalMenu = () => setIsOperasionalOpen((prev) => !prev);

    useEffect(() => {
        document.title = "JavaLine";
        localStorage.setItem("lastPath", location.pathname);
    }, [location]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
            setUser (JSON.parse(userData));
        }
    }, []);

    return (
        <div className="dashboard">
            <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/public/storage/uploads/user/user.png`}
                        alt="Profile"
                        className="toggle-btn"
                        onClick={toggleSidebar}
                        style={{
                            borderRadius: "50%",
                            width: isSidebarOpen ? "40px" : "30px",
                            height: isSidebarOpen ? "40px" : "30px",
                            cursor: "pointer",
                            marginTop: "0px",
                            marginLeft: isSidebarOpen ? "0px" : "-5px",
                            transition: "all 0.3s ease",
                        }}
                    />
                    {isSidebarOpen && (
                        <span
                            className="title-name-profile"
                            style={{
                                marginLeft: "11px",
                                fontSize: "15px",
                                fontWeight: "bold",
                                marginTop: "7px",
                                transition: "opacity 0.3s ease",
                            }}
                        >
                            {user?.karyawan?.nama_lengkap || 'User  '}
                        </span>
                    )}
                </div>

                {isSidebarOpen && (
                    <div style={{ position: "relative", width: "100%" }}>
                        <input
                            type="text"
                            className="form-control search-inputs mb-3"
                            placeholder="Cari menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%",
                                backgroundColor: "#3e4351",
                                color: "#fff",
                                border: "1px solid #d7d7d7",
                                padding: "6px 36px 6px 8px",
                                borderRadius: "8px",
                                height: "32px",
                                fontSize: "14px",
                            }}
                        />
                        {searchQuery && (
                            <span
                                onClick={() => setSearchQuery("")}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "10px",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#ccc",
                                    fontSize: "16px",
                                }}
                            >
                                &times;
                            </span>
                        )}
                    </div>
                )}

                {/* Recommended Menus */}
                {searchQuery && (
                    <div className="recommended-menus">
                        <ul>
                            {filterMenus([...mainMenus, ...masterMenus, ...operasionalMenus]).map((menu, index) => (
                                <li key={index} className={location.pathname === menu.path ? "active" : ""}>
                                    <Link to={menu.path}>
                                        <FontAwesomeIcon icon={menu.icon} className="icon" />
                                        {isSidebarOpen && <span>{menu.name}</span>}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <ul>
                    {/* Main Menu */}
                    {filterMenus(mainMenus).map((menu, index) => (
                        <li key={index} className={location.pathname === menu.path ? "active" : ""}>
                            <Link to={menu.path}>
                                <FontAwesomeIcon icon={menu.icon} className="icon" />
                                {isSidebarOpen && <span>{menu.name}</span>}
                            </Link>
                        </li>
                    ))}

                    {/* Master Menu */}
                    <li className={`master-menu ${isMasterOpen ? "open" : ""}`}>
                        <a href="#" onClick={toggleMasterMenu}>
                            <FontAwesomeIcon icon={faUserCog} className="icon" />
                            {isSidebarOpen && <span>Data Master</span>}
                            {isSidebarOpen && (
                                <FontAwesomeIcon icon={faChevronDown} className={`icon-chevron ${isMasterOpen ? "rotate" : ""}`} />
                            )}
                        </a>
                    </li>
                    {isMasterOpen && filterMenus(masterMenus).map((menu, index) => (
                        <li key={index} className={location.pathname === menu.path ? "active" : ""}>
                            <Link to={menu.path}>
                                <FontAwesomeIcon icon={menu.icon} className="icon small-yellow-icon" />
                                <span>{menu.name}</span>
                            </Link>
                        </li>
                    ))}

                    {/* Operasional Menu */}
                    <li className={`operasional-menu ${isOperasionalOpen ? "open" : ""}`}>
                        <a href="#" onClick={toggleOperasionalMenu}>
                            <FontAwesomeIcon icon={faTruck} className="icon" />
                            {isSidebarOpen && <span>Operasional</span>}
                            {isSidebarOpen && (
                                <FontAwesomeIcon icon={faChevronDown} className={`icon-chevron ${isOperasionalOpen ? "rotate" : ""}`} />
                            )}
                        </a>
                    </li>
                    {isOperasionalOpen && filterMenus(operasionalMenus).map((menu, index) => (
                        <li key={index} className={location.pathname === menu.path ? "active" : ""}>
                            <Link to={menu.path}>
                                <FontAwesomeIcon icon={menu.icon} className="icon small-yellow-icon" />
                                <span>{menu.name}</span>
                            </Link>
                        </li>
                    ))}

                    {/* Logout */}
                    <li>
                        <a href="#" onClick={onLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                            {isSidebarOpen && <span>Logout</span>}
                        </a>
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                <header className="header">
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/public/storage/uploads/user/logo1.png`}
                        alt="Logo PT. JAVA LINE LOGISTICS"
                        className="company-logo"
                    />
                </header>
                <Outlet />
            </main>
        </div>
    );
}