import React from 'react';
import { Outlet } from 'react-router-dom'; // React Router v6에서 사용
import MenuBar from '../page/MenuBar/MenuBar'; // MenuBar 컴포넌트 가져오기
import './Layout.css';

const Layout = () => {
    return (
        <div className="layout">
            <div className="header_cosecose">
                <h1 className="main_title">CoseCose</h1>
            </div>
            {/* 페이지 콘텐츠 */}
            <div className="main-content">
                <Outlet /> {/* 현재 라우트에 해당하는 컴포넌트가 여기에 렌더링 */}
            </div>
            {/* 하단 메뉴바 */}
            <div className="menu-bar-container">
                <MenuBar />
            </div>
        </div>
    );
};

export default Layout;
