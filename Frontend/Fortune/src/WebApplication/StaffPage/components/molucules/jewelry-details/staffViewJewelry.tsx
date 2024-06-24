import { useEffect, useState } from 'react';
import './view-jewelry.scss';
import api from '../../../../../config/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { EditOutlined, FileAddOutlined,SearchOutlined  } from '@ant-design/icons';

function StaffViewJewelry() {
  const [goldJewelry, setGoldJewelry] = useState([]);
  const [silverJewelry, setSilverJewelry] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const successMessage = state && state.successMessage;

  useEffect(() => {
    const fetchGoldJewelry = async () => {
      try {
        const response = await api.get(`api/JewelryGold`);
        console.log(response.data);
        setGoldJewelry(response.data?.$values || []); 
      } catch (err) {
        console.error('Error fetching Gold jewelry', err);
        setGoldJewelry([]);
      }
    };

    const fetchSilverJewelry = async () => {
      try {
        const response = await api.get(`api/JewelrySilver`);
        console.log(response.data);
        setSilverJewelry(response.data?.$values || []); 
      } catch (err) {
        console.error('Error fetching silver jewelry', err);
        setSilverJewelry([]);
      }
    };

    if (accountId) {
      fetchGoldJewelry();
      fetchSilverJewelry();
    } else {
      console.error('No accountId found in loginedUser');
    }
  }, [accountId]);

  useEffect(() => {
    if (successMessage) {
      toast.success("Success Notification !", {
        position: "top-right"
      });
    }
  }, [successMessage]);

  const handleUpdateJewelry = (jewelryId, material) => {
    navigate(`/staff/update-jewelry/${jewelryId}/${material}`);
  };

  const handleRegisterAuction = (jewelryId, material) => {
    navigate(`/register-jewelry-auction/${jewelryId}/${material}`, { state: { jewelryId } });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterJewelry = (jewelry) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      (jewelry.name && jewelry.name.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.description && jewelry.description.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.collection && jewelry.collection.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.goldAge && jewelry.goldAge.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.materials && jewelry.materials.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.weight && jewelry.weight.toLowerCase().includes(lowerCaseQuery))
    );
  };

  return (
    <>
      <div className="jewel-content">
        <h1>Jewelry</h1>
      </div>
      <div className='searchBar'>
        <div className="fui-input-label-animation">
          <SearchOutlined className="search-icon" />
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
       
      
        {goldJewelry.length > 0 && (
          <>
            {goldJewelry.filter(filterJewelry).map((jewelry) => (
              <div key={jewelry.jewelryGoldId} className="jewelry-item">
                <img
                  className='item-img'
                  src={`https://localhost:44361/${jewelry.jewelryImg}`}
                  alt={jewelry.name}
                  onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
                />
                <h3>{jewelry.name}</h3>
                <p>Description: {jewelry.description}</p>
                <p>Category: {jewelry.category}</p>
                <p>Gold Age: {jewelry.goldAge}</p>
                <p>Materials: {jewelry.materials}</p>
                <p>Weight: {jewelry.weight}</p>
                <p>Price: {jewelry.price}$</p>
                <div className="jewelry-item-buttons">
                  <button onClick={() => handleUpdateJewelry(jewelry.jewelryGoldId, "Gold")}>
                    <EditOutlined /> Update
                  </button>
                  <button onClick={() => handleRegisterAuction(jewelry.jewelryGoldId, "Gold")}>
                    <FileAddOutlined /> Register 
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

      
        {silverJewelry.length > 0 && (
          <>
            {silverJewelry.filter(filterJewelry).map((jewelry) => (
              <div key={jewelry.jewelrySilverId} className="jewelry-item">
                <img
                  className='item-img'
                  src={`https://localhost:44361/${jewelry.jewelryImg}`}
                  alt={jewelry.name}
                  onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
                />
                <h3>{jewelry.name}</h3>
                <p>Description: {jewelry.description}</p>
                <p>Category: {jewelry.category}</p>
                <p>Purity: {jewelry.purity}</p>
                <p>Materials: {jewelry.materials}</p>
                <p>Weight: {jewelry.weight}</p>
                <p>Price: {jewelry.price}$</p>
                <div className="jewelry-item-buttons">
                  <button onClick={() => handleUpdateJewelry(jewelry.jewelrySilverId, "Silver")}>
                    <EditOutlined /> Update
                  </button>
                  <button onClick={() => handleRegisterAuction(jewelry.jewelrySilverId, "Silver")}>
                    <FileAddOutlined /> Register 
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

  
        {goldJewelry.length === 0 && silverJewelry.length === 0 && (
          <p>No jewelry items found.</p>
        )}
      </div>
      <ToastContainer className="toast-position" />
    </>
  );
}

export default StaffViewJewelry;
