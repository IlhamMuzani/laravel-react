import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import "../../css/dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCog, faTachometerAlt, faSignOutAlt, faCircle, faBars, faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard({ onLogout }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
    const [isManualOpen, setIsManualOpen] = useState(false);
    const [isMasterOpen, setIsMasterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredMenus, setFilteredMenus] = useState([]);
    const location = useLocation();

    // Daftar menu utama
    const menus = [
        { name: "Dashboard", path: "/dashboard", icon: faTachometerAlt },
        { name: "Data Departemen", path: "/dashboard/departemen", icon: faCircle },
        { name: "Data Karyawan", path: "/dashboard/karyawan", icon: faCircle },
        { name: "Data User", path: "/dashboard/user", icon: faCircle },
        { name: "Data Akses", path: "/dashboard/akses", icon: faCircle },
    ];

    // Handle pencarian menu
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredMenus([]);
        } else {
            const results = menus.filter(menu => 
                menu.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMenus(results);
        }
    }, [searchQuery]);

    return (
        <div className="dashboard">
            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
                <button 
                    className="toggle-btn" 
                    onClick={() => {
                        setIsSidebarOpen(!isSidebarOpen);
                        setIsManualOpen(!isSidebarOpen);
                    }}
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
                
                <ul>
                    <li className={location.pathname === "/dashboard" ? "active" : ""}>
                        <Link to="/dashboard">
                            <FontAwesomeIcon icon={faTachometerAlt} className="icon" />
                            {isSidebarOpen && <span>Dashboard</span>}
                        </Link>
                    </li>

                    {/* Pencarian Menu */}
                    <li className="search-box">
                        <div className="search-container">
                            <FontAwesomeIcon icon={faSearch} className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Cari menu..." 
                                value={searchQuery} 
                                onChange={(e) => setSearchQuery(e.target.value)} 
                                className="search-input"
                            />
                        </div>

                        {/* Rekomendasi menu hasil pencarian */}
                        {filteredMenus.length > 0 && (
                            <ul className="search-results">
                                {filteredMenus.map((menu, index) => (
                                    <li key={index}>
                                        <Link to={menu.path} onClick={() => setSearchQuery("")}>
                                            <FontAwesomeIcon icon={menu.icon} className="icon" />
                                            <span>{menu.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    {/* Menu MASTER */}
                    <li className="master-menu">
                        <a href="#" 
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMasterOpen(!isMasterOpen);
                            }} 
                            className="master-link">
                            <FontAwesomeIcon icon={faUserCog} className="icon" />
                            {isSidebarOpen && <span>MASTER</span>}
                            {isSidebarOpen && (
                                <FontAwesomeIcon 
                                    icon={faChevronDown} 
                                    className={`dropdown-icon ${isMasterOpen ? "rotated" : ""}`}
                                />
                            )}
                        </a>
                        <ul className={`submenu ${isMasterOpen && isSidebarOpen ? "open" : ""}`}>
                            {["departemen", "karyawan", "user", "akses"].map(menu => (
                                <li key={menu} className={location.pathname === `/dashboard/${menu}` ? "active" : ""}>
                                    <Link to={`/dashboard/${menu}`}>
                                        <FontAwesomeIcon icon={faCircle} className="sub-icon" />
                                        <span>Data {menu.charAt(0).toUpperCase() + menu.slice(1)}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {/* Logout */}
                    <li>
                        <a href="#" onClick={onLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                            {isSidebarOpen && <span>Logout</span>}
                        </a>
                    </li>
                </ul>
            </aside>

            {/* Konten utama berubah sesuai route */}
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}
