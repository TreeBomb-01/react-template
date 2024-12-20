import React from "react";
import "./category.css"; // 스타일 파일 연결

const Category = () => {
    return (
        <div className="menu-page">
            <h1>메뉴</h1>
            <ul className="menu-list">
                <li onClick={() => (window.location.href = "/MyInfo")}>마이페이지</li>
                <li onClick={() => (window.location.href = "/main/placelist")}>데이트 스팟 보기</li>
                <li onClick={() => (window.location.href = "/course")}>코스 짜기</li>
                <li onClick={() => (window.location.href = "/FavoritePlace")}>좋아요한 장소</li>
                <li onClick={() => (window.location.href = "/MainForm")}>홈</li>
            </ul>
        </div>
    );
};

export default Category;
