import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './register-jewelry.scss';
import api from '../../../../../config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterJewelryForAuction() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jewelryId } = location.state || {};
  const { material } = useParams();
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;

  const initialFormData = {
    accountId: accountId,
    jewelryGoldId: material === 'Gold' ? jewelryId : null,
    jewelrySilverId: material === 'Silver' ? jewelryId : null,
    jewelryGoldDiaId: material === 'GoldDiamond' ? jewelryId : null,
    date: '',
    startTime: '',
    endTime: '',
    jewelryDetails: {}
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        let response;
        if (material === 'Gold') {
          response = await api.get(`/api/JewelryGold/GetById/${jewelryId}`);
        } else if (material === 'Silver') {
          response = await api.get(`/api/JewelrySilver/GetById/${jewelryId}`);
        } else if (material === 'GoldDiamond') {
          response = await api.get(`/api/JewelryGoldDia/GetById/${jewelryId}`);
        } else {
          console.error('Unsupported jewelry material type:', material);
          return;
        }

        console.log('Jewelry Details:', response.data);
        setFormData(prevState => ({
          ...prevState,
          jewelryDetails: {
            ...response.data,
            materials: material
          }
        }));
      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    if (jewelryId) {
      fetchJewelryDetails();
    }
  }, [jewelryId, material]);


  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate the date is at least 3 days from today
    const chosenDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);
  
    if (chosenDate < minDate) {
      toast.error('The auction date must be at least 3 days from today.', { position: 'top-right' });
      return;
    }
  
    // Validate end time is at least 30 minutes after start time
    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
    const startDateTime = new Date(chosenDate);
    const endDateTime = new Date(chosenDate);
  
    startDateTime.setHours(startHours, startMinutes, 0, 0);
    endDateTime.setHours(endHours, endMinutes, 0, 0);
  
    // Adjust for timezone offset
    const timezoneOffset = startDateTime.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const starttime = new Date(startDateTime - timezoneOffset).toISOString();
    const endtime = new Date(endDateTime - timezoneOffset).toISOString();
  
    try {
      const requestData = {
        accountId: accountId,
        starttime: starttime,
        endtime: endtime
      };
  
      // Add jewelry ID based on material type
      if (material === 'Gold') {
        requestData.jewelryGoldId = formData.jewelryGoldId;
      } else if (material === 'Silver') {
        requestData.jewelrySilverId = formData.jewelrySilverId;
      } else if (material === 'GoldDiamond') {
        requestData.jewelryGoldDiaId = formData.jewelryGoldDiaId; // Corrected variable name
      } else {
        console.error('Unsupported jewelry material type');
        return;
      }
  
      // Determine API URL based on material
      const apiUrl = material === 'Gold' ? '/api/Auctions/CreateGoldJewelryAuction' :
        material === 'Silver' ? '/api/Auctions/CreateSilverJewelryAuction' :
        material === 'GoldDiamond' ? '/api/Auctions/CreateGoldDiamondJewelryAuction' :
        '';
  
      if (!apiUrl) {
        console.error('Unsupported jewelry material type for auction creation');
        return;
      }
  
      const response = await api.post(apiUrl, requestData);
      console.log('Auction created successfully:', response.data);
      toast.success('Auction registered successfully!', { position: 'top-right' });
  
      // Clear form data
      setFormData(initialFormData);
  
      // Delayed navigation after toast appears
      setTimeout(() => {
        navigate('/userJewel');
      }, 1000);
    } catch (error) {
      console.error('Error creating auction:', error);
      if (error.response && error.response.data) {
        console.error('Response Data:', error.response.data);
      }
      toast.error('Error creating auction. Please try again!', { position: 'top-right' });
    }
  };
  
  
  

  return (
    <div className="register-jewelry-form">
      <h2>Auction Register</h2>
      {jewelryId ? (
        <>
          <div className="jewelry-details">
            <h3>Jewelry Details:</h3>
            <p>
              Image:{' '}
              <img
                src={`https://localhost:44361/${formData.jewelryDetails.jewelryImg}`}
                alt={formData.jewelryDetails.name}
                onError={e => {
                  e.target.src = '../../../../../../src/assets/img/jewelry_introduction.jpg';
                }}
              />
            </p>
            <p>Name: {formData.jewelryDetails.name}</p>
            <p>Description: {formData.jewelryDetails.description}</p>
            <p>Category: {formData.jewelryDetails.category}</p>
            {material === 'Gold' && (
              <p>Gold Age: {formData.jewelryDetails.goldAge}</p>
            )}
            {material === 'Silver' && (
              <p>Purity: {formData.jewelryDetails.purity}</p>
            )}
            {material === 'GoldDiamond' && (
              <>
                <p>Gold Age: {formData.jewelryDetails.goldAge}</p>
                <p>Clarity: {formData.jewelryDetails.clarity}</p>
                <p>Carat: {formData.jewelryDetails.carat}</p>
              </>
            )}
            <p>Materials: {formData.jewelryDetails.materials}</p>
            <p>Weight: {formData.jewelryDetails.weight}</p>
            <p>Price: {formData.jewelryDetails.price}$</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Register Auction</button>
          </form>
        </>
      ) : (
        <p>No jewelry selected for auction registration.</p>
      )}
      <ToastContainer className="toast-position" />
    </div>
  );
}

export default RegisterJewelryForAuction;
