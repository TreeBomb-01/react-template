import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceList.css";

const PlaceList = () => {
    const [places, setPlaces] = useState([]);
    const [filteredPlaces, setFilteredPlaces] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("ALL");
    const [sortOption, setSortOption] = useState("인기순");
    const [likedPlaces, setLikedPlaces] = useState({});
    const navigate = useNavigate();
    const [error, setError] = useState(null); // 에러 상태

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await fetch('https://treebomb.mooo.com/api/get_datespot'); // 서버 API 호출
                const result = await response.json(); // JSON 데이터 파싱
                setPlaces(result); // 데이터를 상태에 저장
                setFilteredPlaces(result);
                console.log(result);
            } catch (error) {
                console.error("Error fetching places:", error);
                setError(error.message);
            }
        };

        fetchPlaces();
    }, []);

    useEffect(() => {
        let filtered = places.filter((place) => {
            const matchesSearch =
                searchQuery === "" ||
                place.spotName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                place.locate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                place.tags.some((tag) =>
                    tag.toLowerCase().includes(searchQuery.toLowerCase())
                );

            const matchesTag =
                selectedTag === "ALL" || place.tags.includes(selectedTag);

            return matchesSearch && matchesTag;
        });

        if (sortOption === "인기순") {
            filtered = filtered.sort((a, b) => b.popularity - a.popularity);
        } else if (sortOption === "가격순") {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === "평점순") {
            filtered = filtered.sort((a, b) => b.rating - a.rating);
        }

        setFilteredPlaces(filtered);
    }, [searchQuery, selectedTag, sortOption, places]);

    const toggleLike = (id, event) => {
        setLikedPlaces((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
        event.target.blur();
    };

    const handleCardClick = (id) => {
        navigate(`/placedetails/${id}`);
    };

    return (
        <div className="placelist-container">
            <div className="placelist-search-bar">
                <input
                    type="text"
                    placeholder="장소명, 태그 검색"
                    className="placelist-search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="placelist-search-button">🔍</button>
            </div>

            <div className="placelist-filters-container">
                <div className="placelist-filters">
                    {["ALL", "#카페", "#식당", "#놀거리", "#산책로", "#힐링", "#캠핑"].map(
                        (label, idx) => (
                            <button
                                key={idx}
                                className={`placelist-filter-button ${
                                    selectedTag === label ? "placelist-filter-active" : ""
                                }`}
                                onClick={() => setSelectedTag(label)}
                            >
                                {label}
                            </button>
                        )
                    )}
                </div>
            </div>

            <div className="placelist-sort-options">
                {["인기순", "가격순", "평점순"].map((option) => (
                    <label key={option} className="placelist-sort-label">
                        <input
                            type="radio"
                            name="sortOption"
                            value={option}
                            checked={sortOption === option}
                            onChange={(e) => setSortOption(e.target.value)}
                        />
                        {option}
                    </label>
                ))}
            </div>

            <div className="placelist-places">
                {filteredPlaces.map((place) => (
                    <div
                        key={place.dateSpotIdx}
                        className="placelist-place-card"
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
                            <button
                                className={`placelist-like-button ${
                                    likedPlaces[place.dateSpotIdx] ? "liked" : ""
                                }`}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    toggleLike(place.dateSpotIdx, event);
                                }}
                            >
                                {likedPlaces[place.dateSpotIdx] ? "❤️" : "♡"}
                            </button>
                        </div>
                        <div className="placelist-place-details">
                            <h3 className="placelist-place-name">{place.spotName}</h3>
                            <p className="placelist-place-address">{place.locate}</p>
                            <div className="placelist-place-tags">
                                {place.tags.map((tag, index) => (
                                    <span key={index} className="placelist-place-tag">
                                        #{tag}
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

export default PlaceList;
