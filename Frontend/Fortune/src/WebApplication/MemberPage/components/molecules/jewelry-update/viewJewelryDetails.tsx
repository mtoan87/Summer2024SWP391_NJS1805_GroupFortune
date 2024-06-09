import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../../../config/axios';
import './viewjewDetails.scss';
import { useNavigate } from 'react-router-dom';
function ViewJewelryDetails() {
  const [jewelryDetails, setJewelryDetails] = useState({
    imageUrl: '',
    imageFile: null,
    name: '',
    materials: '',
    description: '',
    weight: '',
    goldage: '',
    collection: ''
  });
  const { id } = useParams();
  const fileInputRef = useRef(null);
const Navigate =useNavigate();
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;
  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const response = await api.get(`/api/Jewelries/GetById/${id}`);
        console.log(response.data);
        setJewelryDetails(response.data);
      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJewelryDetails(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setJewelryDetails(prevState => ({
          ...prevState,
          imageUrl: reader.result,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateJewelry = async () => {
    const updatedJewelryData = {
      accountId: accountId,
      name: jewelryDetails.name,
      materials: jewelryDetails.materials,
      description: jewelryDetails.description,
      weight: jewelryDetails.weight,
      goldage: jewelryDetails.goldage,
      collection: jewelryDetails.collection
    };
  
    try {
      const response = await api.put(`/api/Jewelries/UpdateJewelry?id=${id}`, updatedJewelryData);
      console.log(response.data);
      // Handle success
      Navigate('/userJewel', { state: { successMessage: 'Jewelry updated successfully!' } });

    } catch (error) {
      console.error('Error:', error);
      // Handle error
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
    <div className="upload-label-details" onClick={handleImageClick}>
      <img src={jewelryDetails.imageUrl || '../../../../../../src/assets/img/jewelry_introduction.jpg'} alt={jewelryDetails.name} />
      <div className="upload-text-details">Upload Image</div>
      <input ref={fileInputRef} type="file" id="image" name="image" onChange={handleImageUpload} accept="image/*" />
    </div>
    <label htmlFor="name">Name</label>
    <input type="text" name="name" value={jewelryDetails.name} onChange={handleInputChange} />
    <label htmlFor="description">Description</label>
    <textarea name="description" value={jewelryDetails.description} onChange={handleInputChange} />
    <label htmlFor="collection">Collection</label>
    <input type="text" name="collection" value={jewelryDetails.collection} onChange={handleInputChange} />
    <label htmlFor="goldage">Gold Age</label>
    <input type="text" name="goldage" value={jewelryDetails.goldage} onChange={handleInputChange} />
    <label htmlFor="materials">Materials</label>
    <input type="text" name="materials" value={jewelryDetails.materials} onChange={handleInputChange} />
    <label htmlFor="weight">Weight</label>
    <input type="text" name="weight" value={jewelryDetails.weight} onChange={handleInputChange} />
    <button onClick={handleUpdateJewelry}>Update</button>
  </div>
</div>

      
    </div>
  );
}

export default ViewJewelryDetails;
