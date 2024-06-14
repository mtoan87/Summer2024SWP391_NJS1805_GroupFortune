import React, { useEffect, useState } from 'react';
import './jewelry.scss';
import api from '../../../../../config/axios';

function MemberJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [sliding, setSliding] = useState(false);

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await api.get('api/Jewelries');
        if (response.data && response.data.$values) {
          setJewelry(response.data.$values);
        } else {
          console.error('Unexpected API response structure:', response.data);
        }
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
            <img className='item-img'
              src={`https://localhost:44361/${item.jewelryImg}`} 
              alt={jewelry.name} 
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
            <h3>{item.name}</h3>
            <p>Description: {item.description}</p>
            <p>Collection: {item.collection}</p>
            <p>Gold Age: {item.goldage}k</p>
            <p>Materials: {item.materials}</p>
            <p>Weight: {item.weight} Grams</p>
            <p className="price">{item.price}₫</p>
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
export default MemberJewelry;
