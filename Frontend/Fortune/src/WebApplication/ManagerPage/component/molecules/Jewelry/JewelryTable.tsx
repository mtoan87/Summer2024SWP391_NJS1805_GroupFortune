// JewelryTable.tsx

import React, { useEffect, useState } from 'react';
import api from '../../../../../config/axios';
import './JewelryTable.scss';

interface Jewelry {
  jewelryId: number;
  accountId: number;
  jewelryImg: string;
  name: string;
  materials: string;
  category: string;
  description: string;
  purity?: string;
  goldAge?: string;
  price: number;
  weight: string;
  status: string;
}

function JewelryTable() {
  const [jewelries, setJewelries] = useState<Jewelry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredJewelry, setHoveredJewelry] = useState<Jewelry | null>(null);

  useEffect(() => {
    const fetchJewelries = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/Jewelries');
        console.log('API response:', response.data);
        if (response.data) {
          const silverJewelries = mapJewelries(response.data.jewelrySilver?.$values || [], 'jewelrySilverId');
          const goldJewelries = mapJewelries(response.data.jewelryGold?.$values || [], 'jewelryGoldId');
          const goldDiamondJewelries = mapJewelries(response.data.jewelryGoldDiamond?.$values || [], 'jewelryGolddiaId');
          setJewelries([...silverJewelries, ...goldJewelries, ...goldDiamondJewelries]);
        } else {
          console.error('Invalid response data format:', response.data);
          setError('Invalid response data format');
        }
      } catch (err) {
        console.error('Error fetching jewelries:', err);
        setError('Error fetching jewelries');
      } finally {
        setLoading(false);
      }
    };

    fetchJewelries();
  }, []);

  const mapJewelries = (jewelries: any[], idKey: string): Jewelry[] => {
    return jewelries.map((jewelry: any) => ({
      jewelryId: jewelry[idKey],
      accountId: jewelry.accountId,
      jewelryImg: jewelry.jewelryImg,
      name: jewelry.name,
      materials: jewelry.materials,
      category: jewelry.category,
      description: jewelry.description,
      purity: jewelry.purity || jewelry.goldAge, // Assuming goldAge serves as purity for gold jewelries
      price: jewelry.price,
      weight: jewelry.weight,
      status: jewelry.status,
    }));
  };

  const handleMouseEnter = (jewelry: Jewelry) => {
    setHoveredJewelry(jewelry);
  };

  const handleMouseLeave = () => {
    setHoveredJewelry(null);
  };

  return (
    <div className="jewelry-table-container">
      <h1>Jewelries</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="jewelry-error-message">{error}</p>
      ) : (
        <table className="jewelry-table">
          <thead>
            <tr>
              <th>Jewelry ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Material</th>
              <th>Category</th>
              <th>Purity</th>
              <th>Price</th>
              <th>Weight</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jewelries.map((jewelry) => (
              <tr key={jewelry.jewelryId}>
                <td>{jewelry.jewelryId}</td>
                <td
                  onMouseEnter={() => handleMouseEnter(jewelry)}
                  onMouseLeave={handleMouseLeave}
                  className="jewelry-name"
                >
                  {jewelry.name}
                  {hoveredJewelry === jewelry && (
                    <div className="image-preview">
                      <img src={`https://localhost:44361/${jewelry.jewelryImg}`} alt={jewelry.name} />
                    </div>
                  )}
                </td>
                <td>{jewelry.description}</td>
                <td>{jewelry.materials}</td>
                <td>{jewelry.category}</td>
                <td>{jewelry.purity}</td>
                <td>{jewelry.price}</td>
                <td>{jewelry.weight}</td>
                <td>{jewelry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default JewelryTable;
