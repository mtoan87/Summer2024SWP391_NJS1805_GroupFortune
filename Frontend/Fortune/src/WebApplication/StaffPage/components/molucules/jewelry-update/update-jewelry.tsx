import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios';
import './update-jewelry.scss';

function ViewJewelryDetails() {
  const [jewelryDetails, setJewelryDetails] = useState({
    accountId: '',
    imageUrl: '',
    imageFile: null,
    name: '',
    materials: '',
    description: '',
    category: '',
    weight: '',
    weightUnit: 'grams',
    goldAge: '',
    purity: '',
    price: '',
    collection: '',
    jewelryImg: ''
  });
  const [errors, setErrors] = useState({});
  const { id, material } = useParams();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const response = await api.get(`/api/Jewelry${material === 'gold' ? 'Gold' : 'Silver'}/GetById/${id}`);
        setJewelryDetails({ ...response.data });
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
    const formData = new FormData();
    formData.append('AccountId', jewelryDetails.accountId);
    formData.append('Name', jewelryDetails.name);
    formData.append('Materials', jewelryDetails.materials);
    formData.append('Description', jewelryDetails.description);
    formData.append('Category', jewelryDetails.category);
    formData.append('Weight', jewelryDetails.weight);
    formData.append('Price', jewelryDetails.price);
    formData.append('WeightUnit', jewelryDetails.weightUnit);
    if (jewelryDetails.materials === 'gold') {
      formData.append('GoldAge', jewelryDetails.goldAge);
    } else {
      formData.append('Purity', jewelryDetails.purity);
    }

   if (jewelryDetails.jewelryImg) {
      formData.append('JewelryImg', jewelryDetails.jewelryImg);
    }

    try {
      const endpoint = jewelryDetails.materials === 'gold'
        ? `/api/JewelryGold/UpdateJewelryGoldStaff?id=${id}`
        : `/api/JewelrySilver/UpdateJewelrySilverStaff?id=${id}`;
      await api.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate('/', { state: { successMessage: 'Jewelry updated successfully!' } });
    } catch (error) {
      console.error('Error:', error);
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
            <img className='item-img'
              src={jewelryDetails.imageUrl || `https://localhost:44361/${jewelryDetails.jewelryImg}`}
              alt={jewelryDetails.name}
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
            <div className="upload-text-details">Upload Image</div>
            <input
              ref={fileInputRef}
              type="file"
              id="image"
              name="image"
              onChange={handleImageUpload}
              accept="image/*"
              style={{ display: 'none' }}
            />
          </div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={jewelryDetails.name} onChange={handleInputChange} />
          {errors.name && <span className="error">{errors.name}</span>}
          
          <label htmlFor="weight">Weight</label>
          <div className="input-container">
            <input type="text" name="weight" value={jewelryDetails.weight} onChange={handleInputChange} />
            <select
              className="weight-unit-select"
              name="weightUnit"
              value={jewelryDetails.weightUnit}
              onChange={handleInputChange}
            >
              <option value="grams">g</option>
              <option value="kilograms">kg</option>
              <option value="ounces">oz</option>
              <option value="pounds">lb</option>
            </select>
          </div>
          {errors.weight && <span className="error">{errors.weight}</span>}
          
          <label htmlFor="price">Price</label>
          <div className="input-container">
            <input type="text" name="price" value={jewelryDetails.price} onChange={handleInputChange} />
          </div>
          {errors.price && <span className="error">{errors.price}</span>}
          
          <label htmlFor="description">Description</label>
          <textarea name="description" value={jewelryDetails.description} onChange={handleInputChange} />
          {errors.description && <span className="error">{errors.description}</span>}

          <label htmlFor="materials">Materials</label>
          <select name="materials" value={jewelryDetails.materials} onChange={handleInputChange}>
            <option value="">Select Material</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
            <option value="diamond">Diamond</option>
          </select>
          {errors.materials && <span className="error">{errors.materials}</span>}
          
          {jewelryDetails.materials === 'gold' && (
            <> <label htmlFor="goldAge">Gold Age</label>
            <div className="input-container">
             
              <input type="text" name="goldAge" value={jewelryDetails.goldAge} onChange={handleInputChange} />
              {errors.goldAge && <span className="error">{errors.goldAge}</span>}
              <span className="suffix">K</span>
            </div></>
          )}

          {jewelryDetails.materials === 'silver' && (
            <> <label htmlFor="purity">Purity</label>
            <div className="input-container">
             
              <input type="text" name="purity" value={jewelryDetails.purity} onChange={handleInputChange} />
              {errors.purity && <span className="error">{errors.purity}</span>}
              <span className="suffix">%</span>
            </div></>
          )}

          <label htmlFor="category">Category</label>
          <select name="category" value={jewelryDetails.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            <option value="necklace">Necklace</option>
            <option value="ring">Ring</option>
            <option value="bracelet">Bracelet</option>
            <option value="earrings">Earrings</option>
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
          
          <button onClick={handleUpdateJewelry}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default ViewJewelryDetails;
