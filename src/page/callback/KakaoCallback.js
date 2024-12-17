import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function KakaoCallback({setIsLoggedIn}) {
    const navigate = useNavigate();
    const isCalled = useRef(false);

    useEffect(() => {
        if (isCalled.current) return; // 이미 호출된 경우 종료
        isCalled.current = true;
        // 현재 URL에서 소셜 로그인 인증 코드 추출
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // 백엔드에 인증 코드 전달하여 JWT 발급
            axios.post('https://treebomb.mooo.com/kakao/callback', { code })
                .then(response => {
                    const { token } = response.data;
  
                    // JWT 저장
                    localStorage.setItem('token', token);

                    // URL에서 code 제거
                    window.history.replaceState({}, document.title, window.location.pathname);

                    // 비동기 처리
                    (async () => {
                        try {
                            const response = await axios.get('https://treebomb.mooo.com/api/checkMoreInfoForUuid', {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            });

                            const needInfo = response.data.needInfo; // 서버에서 반환된 'needInfo' 값 사용
                            console.log(needInfo)
                            if (needInfo) {
                                navigate('/signup'); // 추가 정보가 필요하면 회원가입 페이지로 이동
                            } else {
                                setIsLoggedIn(true);
                                navigate('/'); // 추가 정보가 필요 없으면 메인 페이지로 이동
                            }
                        } catch (error) {
                            console.error('콜백 처리 중 오류 발생:', error);
                            navigate('/error'); // 오류 발생 시 에러 페이지로 이동
                        }
                    })();
                })
                .catch(error => {
                    console.error('콜백 처리 중 오류 발생:', error);
                    navigate('/error');
                });
        } else {
            console.error('인증 코드가 없습니다.');
        }
    }, []);

    return <h1>로그인 처리 중...</h1>;
}

export default KakaoCallback;
