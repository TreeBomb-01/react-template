import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignUpForm from './page/signUp/SignUpForm';
import LoginForm from './page/login/LoginFrom';
import MainPage from './page/main/MainForm';
import KakaoCallback from './page/callback/KakaoCallback';
import Layout from './_common/Layout';
import Category from './page/category/category';
import PlaceList from './page/placelist/PlaceList';
import PlaceDetails from './page/placedetails/PlaceDetails';

interface PrivateRouteProps {
    children: React.ReactElement;
}

// PrivateRoute 컴포넌트 정의
const PrivateRoute = ({ children }: PrivateRouteProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // 로딩 중 화면
    }

    return isAuthenticated ? children : <Navigate to="/login" replace />;
};


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    // 루트 경로 접속 시 로그인 상태에 따라 리다이렉트
    const RootRedirect = () => {
        const token = localStorage.getItem('token');
        return token ? <Navigate to="/login" replace /> : <Navigate to="/main" replace />;
    };
    

    return (
        <Router>
            <Routes>
                {/* 루트 경로에 대한 리다이렉트 처리 */}
                <Route path="/" element={<RootRedirect />} />
                
                <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/signup" element={<SignUpForm setIsLoggedIn={setIsLoggedIn}/>} />
                <Route path="/callback/KakaoCallback" element={<KakaoCallback setIsLoggedIn={setIsLoggedIn} />} />
                
                <Route path="/main" element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }>
                    <Route path="" element={<MainPage />}>
                        <Route path="details/:id" element={<PlaceDetails/>}/>
                    </Route>
                    <Route path='category' element={<Category/>} />
                    <Route path='placelist' element={<PlaceList/>}/>
                    <Route path='placedetails/:id' element={<PlaceDetails/>}/>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
