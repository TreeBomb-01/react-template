import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainForm.css'; // CSS 파일 연결

function MainPage() {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        // 현재 URL에서 JWT 추출
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            // JWT를 로컬 스토리지에 저장
            localStorage.setItem('token', token);
            console.log('JWT 저장 완료:', token);

            // URL에서 token 파라미터 제거 (사용자에게 보여지지 않게)
            navigate('/main', { replace: true });
        } else {
            console.error('JWT가 URL에 존재하지 않습니다.');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPlaces = async () => {
            try {               
                const response = await fetch('https:/treebomb.mooo.com:8091/api/get_main_datespot'); // 서버 API 호출
                const result = await response.json(); // JSON 데이터 파싱
                setData(result); // 데이터를 상태에 저장
                console.log(result);
            } catch (error) {
                console.error("Error fetching places:", error);
                setError(error.message);
            }
        };

        fetchPlaces();
    }, []);

    const handleCardClick = (id) => {
        navigate(`/details/${id}`);
    };

    return (
        <div className="place_list_div">
            <div className="event_div">
                <h1 className='event_title'>이달의 축제</h1>
                <div className="event_pic_div">
                    <img
                        className="event_pic"
                        src="/images/event_img/event1.png"
                        alt="이달의 축제"
                    />
                </div>
            </div>
            {Object.keys(data).map((category) => (
                <div className="content_div_popup" key={category}>
                    <h1 className='content_div_title'>#{category}</h1>
                    <div className="content_dive_plcae">
                        {data[category].map((place) => (
                            <div
                                key={place.dateSpotIdx}
                                className="placelist-place-card-main"
                                onClick={() => handleCardClick(place.dateSpotIdx)}
                            >
                                <div className="placelist-place-image-container">
                                    <img
                                        src={place.imageURL}
                                        alt={place.spotName}
                                        className="placelist-place-image"
                                        onError={(e) => {
                                            e.target.src = '/images/non_image.png'; // 이미지 로드 실패 시 대체 이미지
                                        }}
                                    />
                                </div>
                                <div className="placelist-place-details">
                                    <h3 className="placelist-place-name">{place.spotName}</h3>
                                    <p className="placelist-place-address">{place.locate}</p>
                                    <span className="placelist-place-tag">
                                        #{place.tags}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
    
}

export default MainPage;