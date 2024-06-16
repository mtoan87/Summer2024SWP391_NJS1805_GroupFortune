import { useEffect, useState } from 'react';
import '../styles/jewelry.scss';
import api from '../../../config/axios';

function GuestJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const [goldResponse, silverResponse] = await Promise.all([
          api.get('/api/JewelryGold'),
          api.get('/api/JewelrySilver')
        ]);

        const goldJewelry = goldResponse.data && goldResponse.data.$values ? goldResponse.data.$values : [];
        const silverJewelry = silverResponse.data && silverResponse.data.$values ? silverResponse.data.$values : [];

        setJewelry([...goldJewelry, ...silverJewelry]);
      } catch (err) {
        console.error('Error fetching jewelry', err);
      }
    };

    fetchJewelry();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliding(true);
      setTimeout(() => setSliding(false), 1000); // Adjust time as per your sliding animation duration
      nextItems();
    }, 5000); // Change item every 5 seconds
    return () => clearInterval(interval);
  }, [jewelry.length]);

  const nextItems = () => {
    setStartIndex((prevIndex) => (prevIndex + 4) % jewelry.length);
  };

  const prevItems = () => {
    setStartIndex((prevIndex) => (prevIndex - 4 + jewelry.length) % jewelry.length);
  };

  const displayedItems = jewelry.slice(startIndex, startIndex + 4).concat(
    jewelry.slice(0, Math.max(0, startIndex + 4 - jewelry.length))
  );

  return (
    <>
      <div className="jewel-content">
        <h1>Jewelry</h1>
      </div>
      <div className={`jewelry-container ${sliding ? 'slide' : ''}`}>
        {displayedItems.map((item, index) => (
          <div
            key={`${item.jewelryId}-${index}`} // Ensure unique keys using both jewelryId and index
            className="jewelry-item"
          >
             <img 
              src={`https://localhost:44361/${item.jewelry_img}`} 
              alt={item.name} 
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
            <h3>{item.name}</h3>
            <p>Description: {item.description}</p>
            <p>Collection: {item.collection}</p>
            <p>Gold Age: {item.goldage}k</p>
            <p>Materials: {item.materials}</p>
            <p>Weight: {item.weight} Grams</p>
            <p className="price">{item.price}₫</p>
            <p className="installment">0% Trả góp</p>
          </div>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={prevItems}>Previous</button>
        <button onClick={nextItems}>Next</button>
      </div>
    </>
  );
}

export default GuestJewelry;
