import { useEffect, useState } from 'react';
import '../../styles/jewelry.scss';
import api from '../../../../config/axios';

function GuestJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const [goldResponse, silverResponse, diamondResponse] = await Promise.all([
          api.get('/api/JewelryGold'),
          api.get('/api/JewelrySilver'),
          api.get('/api/JewelryGoldDia')
        ]);

        const goldJewelry = goldResponse.data && goldResponse.data.$values ? goldResponse.data.$values : [];
        const silverJewelry = silverResponse.data && silverResponse.data.$values ? silverResponse.data.$values : [];
        const diamondJewelry = diamondResponse.data && diamondResponse.data.$values ? diamondResponse.data.$values : [];
        const combinedJewelry = [...goldJewelry, ...silverJewelry, ...diamondJewelry];

        const jewelryWithImages = await Promise.all(
          combinedJewelry.map(async (item) => {
            const imageUrl = await fetchJewelryImage(item);
            return { ...item, imageUrl };
          })
        );
        console.log(jewelryWithImages);
        setJewelry(jewelryWithImages);
      } catch (err) {
        console.error('Error fetching jewelry', err);
      }
    };

    fetchJewelry();
  }, []);

  const fetchJewelryImage = async (item) => {
    try {
      let apiUrl;
      if (item.jewelryGoldId) {
        apiUrl = `/api/JewelryGold/GetById/${item.jewelryGoldId}`;
      } else if (item.jewelrySilverId) {
        apiUrl = `/api/JewelrySilver/GetById/${item.jewelrySilverId}`;
      } else if (item.jewelryGolddiaId) {
        apiUrl = `/api/JewelryGoldDia/GetById/${item.jewelryGolddiaId}`;
      } else {
        throw new Error("No valid jewelryId found");
      }

      const response = await api.get(apiUrl);
      const imageUrl = response.data.jewelryImg || 'src/assets/img/jewelry_introduction.jpg';
      return `https://localhost:44361/${imageUrl.replace(/\\/g, '/')}`;
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

  return (
    <>
      <div className="jewelry-content">
        <h1>JEWELRY</h1>
      </div>
      <div className="jewelry-container">
        {displayedItems.map((item, index) => (
          <div
            key={`${item.jewelryId}-${index}`}
            className="jewelry-item"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
            <h3>{item.name}</h3>
            <p>Description: {item.description}</p>
            <p>Category: {item.category}</p>
            {item.jewelryGoldId && (
              <>
                <p>Gold Age: {item.goldAge}</p>
              </>
            )}
            {item.jewelrySilverId && (
              <>
                <p>Purity: {item.purity}</p>
              </>
            )}
            {item.materials.includes('Gold') && item.materials.includes('Diamond') && (
              <>
                <p>Clarity: {item.clarity}</p>
                <p>Carat: {item.carat}</p>
                <p>Gold Age: {item.goldAge}</p>
              </>
            )}
            <p>Materials: {item.materials}</p>
            <p>Weight: {item.weight}</p>
            <p className="price">{item.price}$</p>
          </div>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </>
  );
}

export default GuestJewelry;
