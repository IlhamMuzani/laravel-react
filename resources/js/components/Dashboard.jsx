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
    const [filteredMenus, setFilteredMenus] = useState([]);
    const location = useLocation();
    const [user, setUser] = useState(null);

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

    useEffect(() => {
        setFilteredMenus(
            searchQuery.trim() === "" ? [] :
                [...mainMenus, ...masterMenus, ...operasionalMenus].filter(menu => menu.name.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery]);

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
        const lastPath = localStorage.getItem("lastPath") || "/dashboard";

        if (token && userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <div className="dashboard">
            <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
                <div style={{ display: "flex", alignItems: "flex-start" }}> {/* Ganti alignItems ke flex-start */}
                    <img
                        src={`${import.meta.env.VITE_API_URL}/public/storage/uploads/user/user.png`}
                        alt="Profile"
                        className="toggle-btn"
                        onClick={toggleSidebar}
                        style={{
                            borderRadius: "50%",
                            width: "40px",
                            height: "40px",
                            cursor: "pointer",
                            marginTop: "0px", /* Menurunkan foto sedikit */
                        }}
                    />
                    <span className="title-name-profile"
                        style={{
                            marginLeft: "10px",
                            fontSize: "15px",
                            fontWeight: "bold",
                            marginTop: "7px", /* Mengangkat nama sedikit */
                        }}
                    >
                        {user?.karyawan?.nama_lengkap || 'User'}
                    </span>
                </div>
                <ul>
                    {mainMenus.map((menu, index) => (
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
                    {isMasterOpen && masterMenus.map((menu, index) => (
                        <li key={index} className={location.pathname === menu.path ? "active" : ""}>
                            <Link to={menu.path}>
                                <FontAwesomeIcon icon={menu.icon} className="icon small-yellow-icon" />
                                <span>{menu.name}</span>
                            </Link>
                        </li>
                    ))}

                    {/* Operasional Menu */}
                    <li className={`master-menu ${isOperasionalOpen ? "open" : ""}`}>
                        <a href="#" onClick={toggleOperasionalMenu}>
                            <FontAwesomeIcon icon={faTruck} className="icon" />
                            {isSidebarOpen && <span>Operasional</span>}
                            {isSidebarOpen && (
                                <FontAwesomeIcon icon={faChevronDown} className={`icon-chevron ${isOperasionalOpen ? "rotate" : ""}`} />
                            )}
                        </a>
                    </li>
                    {isOperasionalOpen && operasionalMenus.map((menu, index) => (
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
                    {/* Tombol titik tiga */}
                    <button className="toggle-btn" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>

                    {/* Menampilkan logo dari Laravel storage */}
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