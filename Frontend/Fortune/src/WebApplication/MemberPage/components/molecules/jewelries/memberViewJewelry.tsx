import { useEffect, useState } from 'react';
import './jewelry.scss';
import api from '../../../../../config/axios';
import { useNavigate, Link } from 'react-router-dom';
function MemberViewJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await api.get('api/Jewelries');
        console.log(response.data);
        setJewelry(response.data);
      } catch (err) {
        console.error('Error fetching jewelry', err);
      }
    };
    fetchJewelry();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

const handleCreateButton = ()=> {
    navigate('/userJewel/upload');
}

  const filteredJewelry = jewelry.filter(jewelry => 
    jewelry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jewelry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jewelry.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jewelry.goldage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jewelry.materials.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jewelry.weight.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="jewel-content">
        <h1>My Jewelry</h1>
      </div>

      <div className='searchBar'>
        <div className="fui-input-label-animation">
          <input 
            type="text" 
            className="form-input" 
            placeholder='' 
            value={searchQuery} 
            onChange={handleSearchChange} 
          />
          <label htmlFor="name" className="form-label">Search for Jewelry</label>
        </div>
      </div>

      <div className="jewelry-container">
        <div className="auction-item create-auction">
          <img src='../../../../../../src/assets/img/Jewelry.png' alt="Create Jewelry" />
          <button onClick={() => handleCreateButton()}>
            Create Jewelry
          </button>
        </div>
        {filteredJewelry.map((item, index) => (
          <div key={index} className="jewelry-item">
            <img src="../../../../../../src/assets/img/jewelry_introduction.jpg" alt={item.name} />
            <h3>{item.name}</h3>
            <p>Description: {item.description}</p>
            <p>Collection: {item.collection}</p>
            <p>Gold Age: {item.goldage}</p>
            <p>Materials: {item.materials}</p>
            <p>Weight: {item.weight}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default MemberViewJewelry;
