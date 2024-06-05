import { useEffect, useState } from 'react';
import './jewelry.scss';
import api from '../../../../../config/axios';

function MemberJewelry() {
  const [jewelry, setJewelry] = useState([]);

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await api.get('api/Jewelries');
        console.log(response.data); // Check the response structure
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

  return (
    <>
      <div className="jewel-content">
        <h1>Jewelry</h1>
      </div>
      <div className="jewelry-container">
        {jewelry.map((jewelry) => (
            <div key={jewelry.$id} className="jewelry-item">
              <img src="../../../../../../src/assets/img/jewelry_introduction.jpg" alt="" />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Collection: {jewelry.collection}</p>
              <p>Gold Age: {jewelry.goldage}</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Weight: {jewelry.weight}</p>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default MemberJewelry;
