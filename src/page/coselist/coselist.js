import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './coselist.css';

const CoseList = () => {
    const [coses, setCoses] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoses();
    }, []);

    const fetchCoses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://treebomb.mooo.com/api/get_coses', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Fetched coses:', response.data);
            setCoses(response.data);
        } catch (error) {
            console.error('코스 목록 로딩 실패:', error);
        }
    };

    const handleCoseClick = (coseIdx) => {
        navigate(`/cose/${coseIdx}`);
    };

    const handleCreateCose = () => {
        navigate('/main/createcose');
    };

    return (
        <div className="cose-list-container">
            <div className="cose-list-header">
                <h2>데이트 코스 목록</h2>
                <button className="create-cose-button" onClick={handleCreateCose}>
                    새 코스 만들기
                </button>
            </div>

            <div className="cose-list">
                {coses.map((cose) => (
                    <div 
                        key={cose.coseIdx} 
                        className="cose-card"
                        onClick={() => handleCoseClick(cose.coseIdx)}
                    >
                        <div className="cose-places">
                            {[...cose.places]
                                .sort((a, b) => a.order_in_cose - b.order_in_cose)
                                .map((place, index) => (
                                    <div key={index} className="place-preview">
                                        <img 
                                            src={place.imageURL} 
                                            alt={place.spotName}
                                            onError={(e) => {
                                                e.target.src = '/images/non_image.png';
                                            }}
                                        />
                                        {index === 0 && cose.places.length > 1 && (
                                            <div className="place-count">
                                                +{cose.places.length - 1}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                        <div className="cose-info">
                            <h3>{cose.coseName}</h3>
                            <div className="place-names">
                                {[...cose.places]
                                    .sort((a, b) => a.order_in_cose - b.order_in_cose)
                                    .map((place, index) => (
                                        <span key={index}>
                                            {place.spotName}
                                            {index < cose.places.length - 1 ? ' → ' : ''}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CoseList;
