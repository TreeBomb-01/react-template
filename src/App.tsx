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
import CreateCose from './page/cose/createcose';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // 로그인 상태 체크 로직 개선
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            console.log('Current token:', token); // 토큰 값 확인
            setIsLoggedIn(!!token);
            console.log('isLoggedIn status:', !!token); // 로그인 상태 확인
        };

        checkLoginStatus();
        // 로컬 스토리지 변경 감지
        window.addEventListener('storage', checkLoginStatus);
        
        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    // RequireAuth 컴포넌트 수정
    const RequireAuth = ({ children }: { children: JSX.Element }) => {
        const token = localStorage.getItem('token');
        console.log('RequireAuth check - token:', token); // 토큰 체크 시점 확인
        
        if (!token) {
            console.log('No token found, redirecting to login'); // 리다이렉트 발생 확인
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    // RedirectIfLoggedIn 컴포넌트 수정
    const RedirectIfLoggedIn = ({ children }: { children: JSX.Element }) => {
        const token = localStorage.getItem('token');
        console.log('RedirectIfLoggedIn check - token:', token); // 토큰 체크 시점 확인
        
        if (token) {
            console.log('Token found, redirecting to main'); // 리다이렉트 발생 확인
            return <Navigate to="/main" replace />;
        }
        return children;
    };

    return (
        <Router>
            <Routes>
                {/* 루트 경로 리다이렉션 */}
                <Route 
                    path="/" 
                    element={
                        isLoggedIn 
                            ? <Navigate to="/main" replace /> 
                            : <Navigate to="/login" replace />
                    } 
                />

                {/* 비로그인 상태에서만 접근 가능한 라우트 */}
                <Route
                    path="/login"
                    element={
                        <RedirectIfLoggedIn>
                            <LoginForm setIsLoggedIn={setIsLoggedIn} />
                        </RedirectIfLoggedIn>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RedirectIfLoggedIn>
                            <SignUpForm setIsLoggedIn={setIsLoggedIn} />
                        </RedirectIfLoggedIn>
                    }
                />
                <Route path="/callback/KakaoCallback" element={<KakaoCallback setIsLoggedIn={setIsLoggedIn} />} />

                {/* 로그인이 필요한 라우트들 */}
                <Route
                    path="/main"
                    element={
                        <RequireAuth>
                            <Layout />
                        </RequireAuth>
                    }
                >
                    <Route path="" element={<MainPage />}>
                        <Route path="details/:id" element={<PlaceDetails />} />
                    </Route>
                    <Route path="category" element={<Category />} />
                    <Route path="createcose" element={<CreateCose />} />
                    <Route path="placelist" element={<PlaceList />} />
                    <Route path="placedetails/:id" element={<PlaceDetails />} />
                </Route>

                {/* 잘못된 경로로 접근시 로그인 상태에 따라 리다이렉트 */}
                <Route
                    path="*"
                    element={
                        isLoggedIn 
                            ? <Navigate to="/main" replace /> 
                            : <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
