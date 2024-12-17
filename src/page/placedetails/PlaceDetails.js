import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './PlaceDetail.css';

const PlaceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [placeData, setPlaceData] = useState(null);
    
    const isPopup = location.pathname.includes('/details/'); // 팝업 여부 확인

    useEffect(() => {
        const fetchPlaceDetails = async () => {
            try {
                const response = await axios.get(`https://treebomb.mooo.com/api/get_one_datespt?id=${id}`);
                setPlaceData(response.data);
            } catch (error) {
                console.error('Error fetching place details:', error);
            }
        };

        if (id) {
            fetchPlaceDetails();
        }
    }, [id]);

    const handleClose = () => {
        navigate(-1);
    };

    if (!placeData) return <div>Loading...</div>;

    // 팝업 스타일로 렌더링
    if (isPopup) {
        return (
            <div className="place-details-container">
                <div className="place-details-content">
                    <button 
                        className="place-details-close-button"
                        onClick={handleClose}
                    >
                        X
                    </button>

                    <div className="place-details-header">
                        <h1>{placeData.spotName}</h1>
                    </div>

                    <div className="place-details-section">
                        <img 
                            className="place-details-image" 
                            src={placeData.imageURL} 
                            alt={placeData.spotName}
                            onError={(e) => {
                                e.target.src = '/images/non_image.png';
                            }}
                        />

                        <div className="place-additional-info">
                            <h2>장소 정보</h2>
                            <p>위치: {placeData.locate}</p>
                            <p>상세 정보: {placeData.info}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 일반 페이지로 렌더링
    return (
        <div className="place-details-page">
            <div className="place-details-content">
                <div className="place-details-header">
                    <h1>{placeData.spotName}</h1>
                </div>

                <div className="place-details-section">
                    <img 
                        className="place-details-image" 
                        src={placeData.imageURL} 
                        alt={placeData.spotName}
                        onError={(e) => {
                            e.target.src = '/images/non_image.png';
                        }}
                    />

                    <div className="place-additional-info">
                        <h2>장소 정보</h2>
                        <p>위치: {placeData.locate}</p>
                        <p>상세 정보: {placeData.info}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetails;
