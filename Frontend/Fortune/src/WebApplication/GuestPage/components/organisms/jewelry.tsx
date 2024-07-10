import { useEffect, useState } from 'react';
import '../../styles/jewelry.scss';
import api from '../../../../config/axios';

function GuestJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const purity = {
    'PureSilver925': '92.5%',
    'PureSilver999': '99.9%',
    'PureSilver900': '90.0%',
    'PureSilver958': '95.8%'
  };

  const goldAge = {
    Gold24: '24K',
    Gold22: '22K',
    Gold20: '20K',
    Gold18: '18K',
    Gold14: '14K'
  };

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await api.get('/api/Jewelries/GetVerified');
        const { jewelryGold, jewelrySilver, jewelryGoldDiamond } = response.data;

        const goldJewelry = jewelryGold?.$values ?? [];
        const silverJewelry = jewelrySilver?.$values ?? [];
        const diamondJewelry = jewelryGoldDiamond?.$values ?? [];

        const combinedJewelry = [...goldJewelry, ...silverJewelry, ...diamondJewelry];

        const jewelryWithImages = combinedJewelry.map(item => {
          const imageUrl = `https://localhost:44361/${item.jewelryImg.replace(/\\/g, '/')}`;
          return { ...item, imageUrl };
        });

        setJewelry(jewelryWithImages);
      } catch (err) {
        console.error('Error fetching jewelry', err);
      }
    };

    fetchJewelry();
  }, []);

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
            key={`${item.jewelryId || item.jewelryGoldId || item.jewelryGolddiaId}-${index}`}
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
              <p>Gold Age: {goldAge[item.goldAge]}</p>
            )}
            {item.jewelrySilverId && (
              <p>Purity: {purity[item.purity]}</p>
            )}
            {item.jewelryGolddiaId && (
              <>
                <p>Clarity: {item.clarity}</p>
                <p>Carat: {item.carat}</p>
                <p>Gold Age: {goldAge[item.goldAge]}</p>
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
