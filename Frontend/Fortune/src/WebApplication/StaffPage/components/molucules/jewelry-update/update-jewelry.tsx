import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import api from '../../../../../config/axios';
import './update-jewelry.scss';
import { EditOutlined } from '@ant-design/icons';

const shipmentOptions = ["Delivering", "Deliveried"];  // Chỉ định hai lựa chọn

const GoldAgeMapping = {
  'Gold14': '14K',
  'Gold18': '18K',
  'Gold20': '20K',
  'Gold22': '22K',
  'Gold24': '24K'
};

function StaffViewJewelryDetails() {
  const [jewelryDetails, setJewelryDetails] = useState({
    accountId: '',
    imageUrl: '',
    name: '',
    materials: '',
    description: '',
    category: '',
    weight: '',
    weightUnit: '',
    goldAge: '',
    purity: '',
    price: '',
    collection: '',
    jewelryImg: '',
    shipment: ''
  });
  const [errors, setErrors] = useState({});
  const { id, material } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const response = await api.get(`/api/Jewelry${material === 'Gold' ? 'Gold' : 'Silver'}/GetById/${id}`);
        console.log("API Response:", response.data);
        setJewelryDetails(response.data);
      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, material]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJewelryDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleUpdateJewelry = async () => {
    const newErrors = {};
    if (jewelryDetails.materials === 'Silver' && !jewelryDetails.purity) {
      newErrors.purity = 'Purity is required for silver jewelry';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
  
    const formData = new FormData();
    formData.append('AccountId', jewelryDetails.accountId);
    formData.append('Name', jewelryDetails.name);
    formData.append('Materials', jewelryDetails.materials);
    formData.append('Description', jewelryDetails.description);
    formData.append('Category', jewelryDetails.category);
    formData.append('Weight', jewelryDetails.weight);
    formData.append('Price', jewelryDetails.price);
    formData.append('WeightUnit', jewelryDetails.weightUnit);
    formData.append('jewelryImg', jewelryDetails.jewelryImg);
    formData.append('Shipment', jewelryDetails.shipment);
    
    if (material === 'Gold') {
      formData.append('GoldAge', jewelryDetails.goldAge);
    } else {
      const purityMapping = {
        '92.5%': 'PureSilver925',
        '99.9%': 'PureSilver999',
        '90.0%': 'PureSilver900',
        '95.8%': 'PureSilver958',
      };
      const convertedPurity = purityMapping[jewelryDetails.purity];
      formData.append('Purity', convertedPurity);
    }
    try {
      const endpoint = material === 'Gold'
        ? `/api/JewelryGold/UpdateJewelryGoldStaff?id=${id}`
        : `/api/JewelrySilver/UpdateJewelrySilverStaff?id=${id}`;
    
      console.log("Endpoint:", endpoint);
      console.log("FormData:", Array.from(formData.entries()));
      
      const response = await api.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Check response status and data
      console.log("API Response Status:", response.status);
      console.log("API Response Data:", response.data);
      console.log("Endpoint:", endpoint);

      if (response.status === 200) {
        message.success('Jewelry updated successfully!');
        navigate('/');
      } else {
        message.error('Error updating jewelry: Unexpected response status');
      }
    } catch (error) {
      console.error('Error updating jewelry:', error);
      message.error('Error updating jewelry: ' + error.message);
    }
  };
  

  return (
    <div>
      <div className="jewel-content">
        <h1>My Jewelry</h1>
      </div>
      <div className="jewelry-details-container">
        <div className="jewelry-details-item">
          <label htmlFor="image">Image</label>
          <div className="upload-label-details">
            <img className='item-img'
              src={`https://localhost:44361/${jewelryDetails.jewelryImg}`}
              alt={jewelryDetails.name}
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
          </div>

          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={jewelryDetails.name} disabled />

          <label htmlFor="materials">Materials</label>
          <input type="text" name="materials" value={jewelryDetails.materials} disabled />

          <label htmlFor="category">Category</label>
          <input type="text" name="category" value={jewelryDetails.category} disabled />

          {jewelryDetails.materials === 'Gold' && (
            <>
              <label htmlFor="goldAge">Gold Age</label>
              <select name="goldAge" value={jewelryDetails.goldAge} onChange={handleInputChange} disabled>
                {Object.keys(GoldAgeMapping).map(key => (
                  <option key={key} value={key}>{GoldAgeMapping[key]}</option>
                ))}
              </select>
            </>
          )}

          {jewelryDetails.materials === 'Silver' && (
            <>
              <label htmlFor="purity">Purity</label>
              <input type="text" name="purity" value={jewelryDetails.purity} disabled onChange={handleInputChange} />
              {errors.purity && <span className="error">{errors.purity}</span>}
            </>
          )}

          <label htmlFor="price">Price</label>
          <div className="input-container">
            <input type="text" name="price" value={jewelryDetails.price} onChange={handleInputChange} />
          </div>
          {errors.price && <span className="error">{errors.price}</span>}

          <label htmlFor="shipment">Shipment</label>
          <select name="shipment" value={jewelryDetails.shipment} onChange={handleInputChange}>
            {shipmentOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <button onClick={handleUpdateJewelry}><EditOutlined /> Update</button>
        </div>
      </div>
    </div>
  );
}

export default StaffViewJewelryDetails;
