import React, { useEffect, useState } from 'react';
import api from '../../../../../config/axios';
import { Pagination, Input } from 'antd';
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of items per page
  const [searchTerm, setSearchTerm] = useState('');

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
      jewelryId: formatJewelryId(jewelry[idKey], idKey),
      accountId: jewelry.accountId || 'N/A',
      jewelryImg: jewelry.jewelryImg || 'N/A',
      name: jewelry.name || 'N/A',
      materials: jewelry.materials || 'N/A',
      category: jewelry.category || 'N/A',
      description: jewelry.description || 'N/A',
      price: jewelry.price || 0,
      weight: jewelry.weight || 'N/A',
      status: jewelry.status || 'N/A',
    }));
  };

  const formatJewelryId = (id: number, idKey: string): string => {
    switch (idKey) {
      case 'jewelrySilverId':
        return `SilverId:${id}`;
      case 'jewelryGoldId':
        return `GoldId:${id}`;
      case 'jewelryGolddiaId':
        return `GoldDia:${id}`;
      default:
        return `UnknownId:${id}`;
    }
  };

  const handleMouseEnter = (jewelry: Jewelry) => {
    setHoveredJewelry(jewelry);
  };

  const handleMouseLeave = () => {
    setHoveredJewelry(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  // Filter jewelries based on search term
  const filteredJewelries = jewelries.filter(jewelry =>
    jewelry.jewelryId.toString().includes(searchTerm.toLowerCase()) ||
    jewelry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jewelry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jewelry.materials.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jewelry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jewelry.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jewelry.weight.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jewelry.price.toString().includes(searchTerm) // Handle price as a string
  );

  // Calculate current items based on pagination
  const startIndex = (currentPage - 1) * pageSize;
  const currentJewelries = filteredJewelries.slice(startIndex, startIndex + pageSize);

  return (
    <div className="jewelry-table-container">
      <h1>Jewelries</h1>
      <Input
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="jewelry-error-message">{error}</p>
      ) : (
        <>
          <table className="jewelry-table">
            <thead>
              <tr>
                <th>Jewelry ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Material</th>
                <th>Category</th>
                <th>Price</th>
                <th>Weight</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentJewelries.map((jewelry) => (
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
                  <td>{jewelry.price}$</td>
                  <td>{jewelry.weight}</td>
                  <td>{jewelry.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredJewelries.length}
            onChange={handlePageChange}
            className="pagination"
          />
        </>
      )}
    </div>
  );
}

export default JewelryTable;
