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
  const [goldDiamondJewelry, setGoldDiamondJewelry] = useState([]);

  const purity = {
    PureSilver925: '92.5%',
    PureSilver999: '99.9%',
    PureSilver900: '90.0%',
    PureSilver958: '95.8%'
  };

  const goldAge = {
    Gold24: '24K',
    Gold22: '22K',
    Gold20: '20K',
    Gold18: '18K',
    Gold14: '14K'
  };

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

    const fetchGoldDiamondJewelry = async () => {
      try {
        const response = await api.get(`api/JewelryGoldDia/GetAuctionAndJewelryGoldDiamondByAccountId/${accountId}`);
        console.log(response.data);
        setGoldDiamondJewelry(response.data?.$values || []);
      } catch (err) {
        console.error('Error fetching gold diamond jewelry', err);
        setGoldDiamondJewelry([]);
      }
    };

    if (accountId) {
      fetchGoldJewelry();
      fetchSilverJewelry();
      fetchGoldDiamondJewelry();
    } else {
      console.error('No accountId found in loginedUser');
    }
  }, [accountId]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        position: 'top-right'
      });
    }
  }, [successMessage]);

  const checkAuction = async (jewelryId, material) => {
    try {
      const response = await api.get(`api/Auctions/GetById/${jewelryId}`);
      const auction = response.data;

      if (auction) {
        toast.warning('This jewelry has already registered for auction!', {
          position: 'top-right'
        });
        return true;
      }
    } catch (err) {
      console.error(`Error fetching auction for ${material} jewelry with ID ${jewelryId}`, err);
    }
    return false;
  };

  const handleUpdateJewelry = (jewelry, material) => {
    const id = material === 'Gold' ? jewelry.jewelryGoldId : material === 'Silver' ? jewelry.jewelrySilverId : jewelry.jewelryGoldDiaId;
    navigate(`/update-jewelry/${id}/${material}`);
  };

  const handleRegisterAuction = (jewelry, material) => {
    const id = material === 'Gold' ? jewelry.jewelryGoldId : material === 'Silver' ? jewelry.jewelrySilverId : jewelry.jewelryGoldDiaId;
    navigate(`/register-jewelry-auction/${id}/${material}`, { state: { jewelryId: id } });
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
      (jewelry.goldAge && goldAge[jewelry.goldAge]) ||
      (jewelry.materials && jewelry.materials.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.weight && jewelry.weight.toLowerCase().includes(lowerCaseQuery))
    );
  };

  return (
    <>
      <div className="jewel-content">
        <h1>My Jewelry</h1>
      </div>
      <div className="searchBar">
        <div className="fui-input-label-animation">
          <input
            type="text"
            className="form-input"
            placeholder=""
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <label htmlFor="name" className="form-label">
            Search for Jewelry
          </label>
        </div>
      </div>
      <div className="jewelry-container">
        <div className="auction-item create-auction">
          <img src="../../../../../../src/assets/img/Jewelry.png" alt="Create Jewelry" />
          <button onClick={() => navigate('/userJewel/upload')}>Create Jewelry</button>
        </div>

        {/* Display Gold Jewelry */}
        {goldJewelry.length > 0 &&
          goldJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelryGoldId} className="jewelry-item">
              <img
                className="item-img"
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => {
                  e.target.src = 'src/assets/img/jewelry_introduction.jpg';
                }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Gold Age: {goldAge[jewelry.goldAge]}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price}$</p>
              <div className="jewelry-item-buttons">
                <button
                  onClick={() => handleUpdateJewelry(jewelry, 'Gold')}
                  disabled={!!jewelry.price} // Disable button if price is present
                >
                  Update
                </button>
                <button
                  onClick={() => handleRegisterAuction(jewelry, 'Gold')}
                  disabled={jewelry.status === 'Unverified'} // Disable button if no price or status is "Unverified"
                >
                  Register Auction
                </button>
              </div>
            </div>
          ))}

        {/* Display Silver Jewelry */}
        {silverJewelry.length > 0 &&
          silverJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelrySilverId} className="jewelry-item">
              <img
                className="item-img"
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => {
                  e.target.src = 'src/assets/img/jewelry_introduction.jpg';
                }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Purity: {purity[jewelry.purity]}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price}$</p>
              <div className="jewelry-item-buttons">
                <button
                  onClick={() => handleUpdateJewelry(jewelry, 'Silver')}
                  disabled={!!jewelry.price}
                >
                  Update
                </button>
                <button
                  onClick={() => handleRegisterAuction(jewelry, 'Silver')}
                  disabled={jewelry.status === 'Unverified'} 
                >
                  Register Auction
                </button>
              </div>
            </div>
          ))}

        {goldDiamondJewelry.length > 0 &&
          goldDiamondJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelryGoldDiaId} className="jewelry-item">
              <img
                className="item-img"
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => {
                  e.target.src = 'src/assets/img/jewelry_introduction.jpg';
                }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Gold Age: {goldAge[jewelry.goldAge]}</p>
              <p>Clarity: {jewelry.clarity}</p>
              <p>Carat: {jewelry.carat}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price}$</p>
              <div className="jewelry-item-buttons">
                <button
                  onClick={() => handleUpdateJewelry(jewelry, 'Gold, Diamond')}
                  disabled={!!jewelry.price} 
                >
                  Update
                </button>
                <button
                  onClick={() => handleRegisterAuction(jewelry, 'Gold, Diamond')}
                  disabled={jewelry.status === 'Unverified'} 
                >
                  Register Auction
                </button>
              </div>
            </div>
          ))}
        {goldJewelry.length === 0 && silverJewelry.length === 0 && goldDiamondJewelry.length === 0 && (
          <p>No jewelry items found.</p>
        )}
      </div>
      <ToastContainer className="toast-position" />
    </>
  );
}

export default MemberViewJewelry;
