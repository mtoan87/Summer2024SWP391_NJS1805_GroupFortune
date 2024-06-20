import React, { useEffect, useState } from 'react';
import './member-jewelry.scss';
import api from '../../../../../config/axios';
import { useNavigate } from 'react-router-dom';

function MemberJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const [goldResponse, silverResponse] = await Promise.all([
          api.get('/api/JewelryGold'),
          api.get('/api/JewelrySilver')
        ]);

        const goldJewelry = goldResponse.data && goldResponse.data.$values ? goldResponse.data.$values : [];
        const silverJewelry = silverResponse.data && silverResponse.data.$values ? silverResponse.data.$values : [];
        const combinedJewelry = [...goldJewelry, ...silverJewelry];

        const jewelryWithImages = await Promise.all(
          combinedJewelry.map(async (item) => {
            const imageUrl = await fetchJewelryImage(item);
            return { ...item, imageUrl };
          })
        );

        setJewelry(jewelryWithImages);
      } catch (err) {
        console.error('Error fetching jewelry', err);
      }
    };

    fetchJewelry();
  }, []);

  const fetchJewelryImage = async (item) => {
    try {
      const apiUrl = item.jewelryGoldId
        ? `/api/JewelryGold/GetById/${item.jewelryGoldId}`
        : `/api/JewelrySilver/GetById/${item.jewelrySilverId}`;

      const response = await api.get(apiUrl);
      const imageUrl = response.data.jewelryImg || 'src/assets/img/jewelry_introduction.jpg';
      return imageUrl;
    } catch (err) {
      console.error('Error fetching jewelry image:', err);
      return 'src/assets/img/jewelry_introduction.jpg';
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(jewelry.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = jewelry.slice(startIndex, startIndex + itemsPerPage);

  const handleJewelryClick = (jewelryId) => {
    navigate(`/jewelry/${jewelryId}`);
  };

  return (
    <>
      <div className="member-jewel-content">
        <h1>Jewelry</h1>
      </div>
      <div className="member-jewelry-container">
        {displayedItems.map((item, index) => (
          <div
            key={`${item.jewelryId}-${index}`}
            className="member-jewelry-item"
            onClick={() => handleJewelryClick(item.jewelryGoldId || item.jewelrySilverId)}
          >
            <img
              src={`https://localhost:44361/${item.imageUrl}`}
              alt={item.name}
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
            <h3>{item.name}</h3>
            <p>Description: {item.description}</p>
            {item.jewelryGoldId ? (
              <p>Gold Age: {item.goldAge}</p>
            ) : (
              <p>Purity: {item.purity}</p>
            )}
            <p>Materials: {item.materials}</p>
            <p>Weight: {item.weight}</p>
            <p className="price">{item.price}$</p>
          </div>
        ))}
      </div>
      <div className="member-navigation-buttons">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </>
  );
}

export default MemberJewelry;
