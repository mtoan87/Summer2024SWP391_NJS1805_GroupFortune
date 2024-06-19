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
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        const response = await api.get(`/api/Jewelry${material === 'gold' ? 'Gold' : 'Silver'}/GetById/${id}`);
        setJewelryDetails({ ...response.data, accountId: accountId });
      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, accountId, material]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} with value:`, value); // Log the updated field and its value
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

  const validateInputs = () => {
    let tempErrors = {};
    if (!jewelryDetails.name) tempErrors.name = "Name is required";
    if (!jewelryDetails.description) tempErrors.description = "Description is required";
    if (jewelryDetails.materials === 'gold' && !jewelryDetails.goldAge) tempErrors.goldAge = "Gold age is required";
    if (jewelryDetails.materials === 'silver' && !jewelryDetails.purity) tempErrors.purity = "Purity is required";
    if (!jewelryDetails.materials) tempErrors.materials = "Materials are required";
    if (!jewelryDetails.price || isNaN(jewelryDetails.price)) tempErrors.price = "Valid price is required";
    if (!jewelryDetails.category) tempErrors.category = "Category is required";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleUpdateJewelry = async () => {
    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append('AccountId', jewelryDetails.accountId);
    formData.append('Name', jewelryDetails.name);
    formData.append('Materials', jewelryDetails.materials);
    formData.append('Description', jewelryDetails.description);
    formData.append('Category', jewelryDetails.category);
    formData.append('Weight', `${jewelryDetails.weight} ${jewelryDetails.weightUnit}`);
    formData.append('Price', jewelryDetails.price);
    formData.append('Collection', jewelryDetails.collection || ''); // Assuming collection is a string
    if (jewelryDetails.materials === 'gold') {
      formData.append('Goldage', jewelryDetails.goldAge);
    } else {
      formData.append('Purity', jewelryDetails.purity);
    }
    if (jewelryDetails.imageFile) {
      formData.append('JewelryImg', jewelryDetails.imageFile);
    }

    try {
      const endpoint = jewelryDetails.materials === 'gold' 
        ? `/api/JewelryGold/UpdateJewelryGold?id=${id}` 
        : `/api/JewelrySilver/UpdateJewelrySilver?id=${id}`;
      await api.put(endpoint, formData);
      navigate('/userJewel', { state: { successMessage: 'Jewelry updated successfully!' } });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div className="jewel-content-renamed">
        <h1>My Jewelry</h1>
      </div>
      <div className="jewelry-details-container-renamed">
        <div className="jewelry-details-item-renamed">
          <label htmlFor="image">Image</label>
          <div className="upload-label-details-renamed" onClick={handleImageClick}>
            <img className='item-img-renamed'
              src={jewelryDetails.imageUrl || `https://localhost:44361/${jewelryDetails.jewelryImg}`}
              alt={jewelryDetails.name}
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
            <div className="upload-text-details-renamed">Upload Image</div>
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
          {errors.name && <span className="error-renamed">{errors.name}</span>}
          <label htmlFor="description">Description</label>
          <textarea name="description" value={jewelryDetails.description} onChange={handleInputChange} />
          {errors.description && <span className="error-renamed">{errors.description}</span>}

          <label htmlFor="materials">Materials</label>
          <select name="materials" value={jewelryDetails.materials} onChange={handleInputChange}>
            <option value="">Select Material</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="platinum">Platinum</option>
            <option value="diamond">Diamond</option>
          </select>
          {errors.materials && <span className="error-renamed">{errors.materials}</span>}
          
          {jewelryDetails.materials === 'gold' && (
            <div className="input-container-renamed">
              <label htmlFor="goldAge">Gold Age</label>
              <input type="text" name="goldAge" value={jewelryDetails.goldAge} onChange={handleInputChange} />
              {errors.goldAge && <span className="error-renamed">{errors.goldAge}</span>}
              <span className="suffix-renamed">k</span>
            </div>
          )}

          {jewelryDetails.materials === 'silver' && (
            <div className="input-container-renamed">
              <label htmlFor="purity">Purity</label>
              <input type="text" name="purity" value={jewelryDetails.purity} onChange={handleInputChange} />
              {errors.purity && <span className="error-renamed">{errors.purity}</span>}
              <span className="suffix-renamed">%</span>
            </div>
          )}

          <label htmlFor="category">Category</label>
          <select name="category" value={jewelryDetails.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            <option value="necklace">Necklace</option>
            <option value="ring">Ring</option>
            <option value="bracelet">Bracelet</option>
            <option value="earrings">Earrings</option>
          </select>
          {errors.category && <span className="error-renamed">{errors.category}</span>}
          <div className="input-container-renamed">
            <label htmlFor="weight">Weight</label>
            <input type="text" name="weight" value={jewelryDetails.weight} onChange={handleInputChange} />
            <select
              className="weight-unit-select-renamed"
              name="weightUnit"
              value={jewelryDetails.weightUnit}
              onChange={handleInputChange}
            >
              <option value="grams">g</option>
              <option value="kilograms">kg</option>
              <option value="ounces">oz</option>
              <option value="pounds">lb</option>
            </select>
            {errors.weight && <span className="error-renamed">{errors.weight}</span>}
          </div>
          <div className="input-container-renamed">
            <label htmlFor="price">Price</label>
            <input type="text" name="price" value={jewelryDetails.price} onChange={handleInputChange} />
            <span className="suffix-renamed">$</span>
            {errors.price && <span className="error-renamed">{errors.price}</span>}
          </div>
          <button className="update-button-renamed" onClick={handleUpdateJewelry}>Update</button>
        </div>
      </div>
    </div>
  );
}

export default ViewJewelryDetails;
