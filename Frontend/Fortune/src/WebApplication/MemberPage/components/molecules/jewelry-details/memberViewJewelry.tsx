import { useEffect, useState } from 'react';
import './view-jewelry.scss';
import api from '../../../../../config/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function MemberViewJewelry() {
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
        const response = await api.get(`api/JewelryGold/GetAuctionAndJewelryGoldByAccountId/${accountId}`);
        console.log(response.data);
        setGoldJewelry(response.data?.$values || []);
      } catch (err) {
        console.error('Error fetching gold jewelry', err);
        setGoldJewelry([]);
      }
    };

    const fetchSilverJewelry = async () => {
      try {
        const response = await api.get(`api/JewelrySilver/GetAuctionAndJewelrySilverByAccountId/${accountId}`);
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
      toast.success(successMessage, {
        position: "top-right"
      });
    }
  }, [successMessage]);

  const checkAuction = async (jewelryId, material) => {
    try {
      const response = await api.get(`api/Auctions/GetById/${jewelryId}`);
      const auction = response.data;

      if (auction) {
        toast.warning("This jewelry has already registered for auction!", {
          position: "top-right"
        });
        return true;
      }
    } catch (err) {
      console.error(`Error fetching auction for ${material} jewelry with ID ${jewelryId}`, err);
    }
    return false;
  };

  const handleUpdateJewelry = (jewelry, material) => {
    if (jewelry.price) {
      toast.warning("This jewelry is approving. Cannot update!", {
        position: "top-right"
      });
      return;
    }
    const id = material === 'Gold' ? jewelry.jewelryGoldId : jewelry.jewelrySilverId;
    navigate(`/update-jewelry/${id}/${material}`);
  };

  const handleRegisterAuction = async (jewelry, material) => {
    const id = material === 'Gold' ? jewelry.jewelryGoldId : jewelry.jewelrySilverId;
    const auctionExists = await checkAuction(id, material);

    if (!auctionExists) {
      if (jewelry.status === "UnVerified") {
        toast.warning("This jewelry is unverified. Cannot register for auction!", {
          position: "top-right"
        });
        return;
      }
      navigate(`/register-jewelry-auction/${id}/${material}`, { state: { jewelryId: id } });
    }
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
          <button onClick={() => navigate('/userJewel/upload')}>Create Jewelry</button>
        </div>

        {/* Display Gold Jewelry */}
        {goldJewelry.length > 0 && (
          <>
            {goldJewelry.filter(filterJewelry).map((jewelry) => (
              <div key={jewelry.jewelryGoldId} className="jewelry-item">
                <img
                  className='item-img'
                  src={`https://localhost:44361/assets/${jewelry.jewelryImg}`}
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
                  <button onClick={() => handleUpdateJewelry(jewelry, 'Gold')}>Update</button>
                  <button onClick={() => handleRegisterAuction(jewelry, 'Gold')}>Register Auction</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Display Silver Jewelry */}
        {silverJewelry.length > 0 && (
          <>
            {silverJewelry.filter(filterJewelry).map((jewelry) => (
              <div key={jewelry.jewelrySilverId} className="jewelry-item">
                <img
                  className='item-img'
                  src={`https://localhost:44361/assets/${jewelry.jewelryImg}`}
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
                  <button onClick={() => handleUpdateJewelry(jewelry, 'Silver')}>Update</button>
                  <button onClick={() => handleRegisterAuction(jewelry, 'Silver')}>Register Auction</button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* No jewelry found message */}
        {goldJewelry.length === 0 && silverJewelry.length === 0 && (
          <p>No jewelry items found.</p>
        )}
      </div>
      <ToastContainer className="toast-position" />
    </>
  );
}

export default MemberViewJewelry;
