import React from 'react';
import './LoginForm.css'; // CSS 파일 연결
import axios from 'axios';

function LoginForm(setIsLoggedIn) {
    const kakaoLoginURL = process.env.REACT_APP_KAKAO_URL;

    const handleSocialLogin = async (provider) => {
        try {
            const response = await axios.get(`http://localhost:8081/${provider}/login`);
            const LoginUrl = response.data; // URL 문자열
            window.location.href = LoginUrl;
            const { token } = await response.json();

            // JWT 저장
            localStorage.setItem('token', token);

            // 로그인 상태 업데이트
            setIsLoggedIn(true);
        } catch (error) {
            console.error('소셜 로그인 실패:', error);
        }
    };
    
    return (
        <div className='login_From'>
            {/* Title */}
            <div className="title">CoseCose</div>

            {/* Kakao Login */}
            <div className="button kakao-login" onClick={() => handleSocialLogin('kakao')}>
                <a href={kakaoLoginURL}>
                    <img src="/images/login_img/kakao.png" alt="카카오 로그인" width="300" />
                </a>
            </div>

            {/* Naver Login */}
            <div className="button naver-login" onClick={() => handleSocialLogin('naver')}>
                <a href="naver/login">
                    <img src="/images/login_img/naver.png" alt="네이버 로그인" width="300" />
                </a>
            </div>

            {/* Google Login */}
            <div className="button google-login" onClick={() => handleSocialLogin('google')}>
                <a href="google/login">
                    <img src="/images/login_img/google.png" alt="구글 로그인" width="300" />
                </a>
            </div>

            {/* Footer */}
            <div className='footer'>
                <a href="/customer-support">고객센터</a> | <a href="/inquiry">문의하기</a>
            </div>
        </div>
    );
}

export default LoginForm;
