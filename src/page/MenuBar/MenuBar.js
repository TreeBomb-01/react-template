import React from "react";
import { Outlet } from 'react-router-dom';
import "./MenuBar.css"; // CSS 파일을 임포트

const MenuBar = () => {
    return (
        <nav className="menu-bar">
            <a href="/main/category" className="menu-link">
                <img src="/images/menubar_img/Category.png" alt="Category" className="menu-icon"/>
            </a>
            <a href="/main/coselist" className="menu-link">
                <img src="/images/menubar_img/Course.png" alt="Course" className="menu-icon"/>
            </a>
            <a href="/" className="menu-link">
                <img src="/images/menubar_img/Home.png" alt="MainForm" className="menu-icon"/>
            </a>
            <a href="/FavoritePlace" className="menu-link">
                <img src="/images/menubar_img/Favorite.png" alt="Favorite" className="menu-icon"/>
            </a>
            <a href="/MyInfo" className="menu-link">
                <img src="/images/menubar_img/MyInfo.png" alt="MyInfo" className="menu-icon"/>
            </a>
        </nav>
    );
};

export default MenuBar;
