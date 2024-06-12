import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios';
import './viewjewDetails.scss';

function ViewJewelryDetails() {
  const [jewelryDetails, setJewelryDetails] = useState({
    imageUrl: '',
    imageFile: null,
    name: '',
    materials: '',
    description: '',
    weight: '',
    goldage: '',
    collection: '',
    price: '',
    jewelryImg: ''
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
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
          imageFile: file,
          jewelryImg: reader.result.split(',')[1] // Remove the prefix so only the base64 string is sent
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateInputs = () => {
    let tempErrors = {};
    if (!jewelryDetails.name) tempErrors.name = "Name is required";
    if (!jewelryDetails.description) tempErrors.description = "Description is required";
    if (!jewelryDetails.collection) tempErrors.collection = "Collection is required";
    if (!jewelryDetails.goldage) tempErrors.goldage = "Gold age is required";
    if (!jewelryDetails.materials) tempErrors.materials = "Materials are required";
    if (!jewelryDetails.weight || isNaN(jewelryDetails.weight)) tempErrors.weight = "Valid weight is required";
    if (!jewelryDetails.price || isNaN(jewelryDetails.price)) tempErrors.price = "Valid price is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdateJewelry = async () => {
    if (!validateInputs()) return;

    const updatedJewelryData = {
      accountId: accountId,
      name: jewelryDetails.name,
      materials: jewelryDetails.materials,
      description: jewelryDetails.description,
      weight: jewelryDetails.weight,
      goldage: jewelryDetails.goldage,
      collection: jewelryDetails.collection,
      price: jewelryDetails.price,
      jewelryImg: jewelryDetails.jewelryImg
    };

    console.log('Updated Jewelry Data:', updatedJewelryData);

    try {
      console.log(updatedJewelryData);
      const response = await api.put(`/api/Jewelries/UpdateJewelry?id=${id}`, updatedJewelryData);
      console.log(response.data);
      // Handle success
      navigate('/userJewel', { state: { successMessage: 'Jewelry updated successfully!' } });
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
          <img 
        src={jewelryDetails.jewelryImg || "../../../../../../src/assets/img/jewelry_introduction.jpg"} 
        alt={jewelryDetails.name} 
      />
            <div className="upload-text-details">Upload Image</div>
            <input ref={fileInputRef} type="file" id="image" name="image" onChange={handleImageUpload} accept="image/*" />
          </div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={jewelryDetails.name} onChange={handleInputChange} />
          {errors.name && <span className="error">{errors.name}</span>}
          <label htmlFor="description">Description</label>
          <textarea name="description" value={jewelryDetails.description} onChange={handleInputChange} />
          {errors.description && <span className="error">{errors.description}</span>}
          <label htmlFor="collection">Collection</label>
          <input type="text" name="collection" value={jewelryDetails.collection} onChange={handleInputChange} />
          {errors.collection && <span className="error">{errors.collection}</span>}
          <label htmlFor="goldage">Gold Age</label>
          <input type="text" name="goldage" value={jewelryDetails.goldage} onChange={handleInputChange} />
          {errors.goldage && <span className="error">{errors.goldage}</span>}
          <label htmlFor="materials">Materials</label>
          <input type="text" name="materials" value={jewelryDetails.materials} onChange={handleInputChange} />
          {errors.materials && <span className="error">{errors.materials}</span>}
          <label htmlFor="weight">Weight</label>
          <input type="text" name="weight" value={jewelryDetails.weight} onChange={handleInputChange} />
          {errors.weight && <span className="error">{errors.weight}</span>}
          <label htmlFor="price">Price</label>
          <input type="text" name="price" value={jewelryDetails.price} onChange={handleInputChange} />
          {errors.price && <span className="error">{errors.price}</span>}
          <button onClick={handleUpdateJewelry}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default ViewJewelryDetails;