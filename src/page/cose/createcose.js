import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './createcose.css';

const CreateCose = () => {
    const navigate = useNavigate();
    const [courseName, setCourseName] = useState('');
    const [selectedPlaces, setSelectedPlaces] = useState([]);
    const [availablePlaces, setAvailablePlaces] = useState([]);

    // 모든 장소 불러오기
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await axios.get('https://treebomb.mooo.com/api/get_datespot');
                setAvailablePlaces(response.data);
            } catch (error) {
                console.error('장소 로딩 실패:', error);
            }
        };
        fetchPlaces();
    }, []);

    // 장소 선택
    const handlePlaceSelect = (place) => {
        if (selectedPlaces.length < 5) {
            setSelectedPlaces([...selectedPlaces, place]);
        } else {
            alert('최대 5개의 장소만 선택할 수 있습니다.');
        }
    };

    // 선택된 장소 제거
    const handleRemovePlace = (index) => {
        const newPlaces = selectedPlaces.filter((_, i) => i !== index);
        setSelectedPlaces(newPlaces);
    };

    // 코스 저장
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedPlaces.length < 2) {
            alert('최소 2개 이상의 장소를 선택해주세요.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://treebomb.mooo.com/api/create_course', {
                courseName,
                places: selectedPlaces.map(place => place.id)
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            alert('코스가 성공적으로 생성되었습니다!');
            navigate('/main');
        } catch (error) {
            console.error('코스 생성 실패:', error);
            alert('코스 생성에 실패했습니다.');
        }
    };

    return (
        <div className="create-course-container">
            <div className="fixed-header">
                <h2>새로운 코스 만들기</h2>
                
                <div className="form-group">
                    <input
                        type="text"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="코스 이름을 입력하세요"
                        required
                        className="course-name-input"
                    />
                </div>

                {/* 선택된 장소들 - 항상 표시 */}
                <div className="selected-places">
                    <h3>선택된 장소 ({selectedPlaces.length}/5)</h3>
                    <div className="selected-places-list">
                        {selectedPlaces.map((place, index) => (
                            <div key={index} className="selected-place-item">
                                <div className="place-image-container">
                                    <img 
                                        src={place.imageURL} 
                                        alt={place.spotName}
                                        onError={(e) => {
                                            e.target.src = '/images/non_image.png';
                                        }}
                                    />
                                    <button 
                                        type="button" 
                                        className="remove-button"
                                        onClick={() => handleRemovePlace(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                                <p className="place-name">{place.spotName}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="scrollable-content">
                <div className="places-list">
                    {availablePlaces.map((place) => (
                        <div 
                            key={place.id} 
                            className="place-list-item"
                            onClick={() => handlePlaceSelect(place)}
                        >
                            <img 
                                src={place.imageURL} 
                                alt={place.spotName}
                                onError={(e) => {
                                    e.target.src = '/images/non_image.png';
                                }}
                            />
                            <div className="place-info">
                                <h4>{place.spotName}</h4>
                                <p className="place-address">{place.locate}</p>
                                <div className="place-tags">
                                    {place.tags && place.tags.map((tag, index) => (
                                        <span key={index} className="tag">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button type="submit" className="submit-button" onClick={handleSubmit}>
                코스 만들기
            </button>
        </div>
    );
};

export default CreateCose;
