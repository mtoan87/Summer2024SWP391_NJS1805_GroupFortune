import { useEffect, useState } from 'react';
import './jewelry.scss';
import api from '../../../../../config/axios';

function Jewelry() {
  const [jewelry, setJewelry] = useState([]);

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await api.get('Jewelries');
        console.log(response.data);
        setJewelry(response.data);
      } catch (err) {
        console.error('Error fetching jewelry', err);
      }
    };
    fetchJewelry();
  }, []);

  return (
    <>
      <div className="jewel-content">
        <h1>Jewelry</h1>
      </div>
      <div className="jewelry-container">
        {jewelry.map((item, index) => (
          <div key={index} className="jewelry-item">
            <img src="../../../../../../src/assets/img/jewelry_introduction.jpg" alt="" />
            <h3>{item.name}</h3>
            <p>Description: {item.description}</p>
            <p>Collection: {item.collection}</p>
            <p>Gold Age: {item.goldage}</p>
            <p>Materials: {item.materials}</p>
            <p>Weight: {item.weight}</p>
            {/* Add additional fields as needed */}
          </div>
        ))}
      </div></>

  );
}

export default Jewelry;
