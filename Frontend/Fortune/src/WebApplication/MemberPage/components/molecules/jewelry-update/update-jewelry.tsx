import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios';
import './update-jewelry.scss';

function ViewJewelryDetails() {
  const [jewelryDetails, setJewelryDetails] = useState({
    accountId: '',
    imageUrl: '',
    imageFile: '',
    name: '',
    materials: '',
    description: '',
    category: '',
    weight: '',
    goldAge: '',
    purity: '',
    jewelryImg: '',
    clarity: '',
    carat: '',
    status: ''
  });
  const [errors, setErrors] = useState({});
  const { id, material } = useParams();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;

  const purity = {
    '92.5%': 'PureSilver925',
    '99.9%': 'PureSilver999',
    '90.0%': 'PureSilver900',
    '95.8%': 'PureSilver958'
  };

  const materials = {
    'Gold': 'Gold',
    'Silver': 'Silver',
    'GoldDiamond': 'Gold, Diamond'
  };

  const goldAges = {
    '24K': 'Gold24',
    '22K': 'Gold22',
    '18K': 'Gold18',
    '14K': 'Gold14'
  };

  const category = {
    'Ring': 'Ring',
    'Necklace': 'Necklace',
    'Bracelet': 'Bracelet',
    'Earrings': 'Earrings',
    'Pendant': 'Pendant',
  };

  const clarity = {
    'FL': 'FL',
    'IF': 'IF',
    'VVS1': 'VVS1',
    'VVS2': 'VVS2',
    'VS1': 'VS1',
    'VS2': 'VS2',
    'SI1': 'SI1',
    'SI2': 'SI2',
    'I1': 'I1',
    'I2': 'I2',
    'I3': 'I3'
  };

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        let response;
        if (material === 'Gold') {
          response = await api.get(`/api/JewelryGold/GetById/${id}`);
        } else if (material === 'GoldDiamond') {
          response = await api.get(`/api/JewelryGoldDia/GetById/${id}`);
        } else {
          response = await api.get(`/api/JewelrySilver/GetById/${id}`);
        }

        setJewelryDetails(prevState => ({
          ...prevState,
          ...response.data,
          accountId: accountId
        }));
      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    fetchJewelryDetails();
  }, [id, material, accountId]);

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
    if (jewelryDetails.materials === 'Gold') {
      formData.append('GoldAge', jewelryDetails.goldAge);
    } else if (jewelryDetails.materials === 'Silver') {
      if (purity[jewelryDetails.purity]) {
        formData.append('Purity', purity[jewelryDetails.purity]);
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          purity: 'Invalid Purity value'
        }));
        return;
      }
    } else if (jewelryDetails.materials === 'GoldDiamond') {
      formData.append('Clarity', clarity[jewelryDetails.clarity]);
      formData.append('Carat', jewelryDetails.carat);
      formData.append('GoldAge', jewelryDetails.goldAge);
    }
    if (jewelryDetails.imageFile) {
      formData.append('JewelryImg', jewelryDetails.imageFile);
    } else {
      formData.append('JewelryImg', jewelryDetails.jewelryImg);
    }

    try {
      const endpoint = jewelryDetails.materials === 'Gold'
        ? `/api/JewelryGold/UpdateJewelryGoldMember?id=${id}`
        : jewelryDetails.materials === 'Silver'
          ? `/api/JewelrySilver/UpdateJewelrySilverMember?id=${id}`
          : `/api/JewelryGoldDia/UpdateJewelryGoldDiamondMember?id=${id}`;

      const response = await api.put(endpoint, formData);
      if (response.status === 200) {
        navigate('/userJewel', { state: { successMessage: 'Jewelry updated successfully!' } });
      } else {
        setErrors({ form: 'Failed to update jewelry. Please try again.' });
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ form: 'Failed to update jewelry. Please try again.' });
    }
  };

  return (
    <div>
      <div className="jewel-content-renamed">
        <h1>Update Jewelry</h1>
      </div>
      <div className="jewelry-details-container-renamed">
        <div className="jewelry-details-item-renamed">
          <label htmlFor="image">Image</label>
          <div className="upload-label-details-renamed" onClick={handleImageClick}>
            <img
              className='item-img-renamed'
              src={jewelryDetails.imageUrl || `https://localhost:44361/${jewelryDetails.jewelryImg}`}
              alt={jewelryDetails.name}
              onError={(e) => { e.target.src = "/assets/img/jewelry_introduction.jpg"; }}
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
          {errors.jewelryImg && <span className="error-renamed">{errors.jewelryImg}</span>}
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={jewelryDetails.name} onChange={handleInputChange} />
          {errors.name && <span className="error-renamed">{errors.name}</span>}
          <label htmlFor="description">Description</label>
          <textarea name="description" value={jewelryDetails.description} onChange={handleInputChange} />
          {errors.description && <span className="error-renamed">{errors.description}</span>}

          <label htmlFor="materials">Materials</label>
          <input type="text" name="name" value={materials[jewelryDetails.materials]} onChange={handleInputChange} />
          {errors.material && <span className="error-renamed">{errors.material}</span>}

          {jewelryDetails.materials === 'Gold' && (
            <div className="input-container-renamed">
              <label htmlFor="goldAge">Gold Age</label>
              <select
                id="goldage"
                name="goldAge"
                value={jewelryDetails.goldAge}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gold Age</option>
                {Object.keys(goldAges).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              {errors.goldAge && <span className="error-renamed">{errors.goldAge}</span>}
            </div>
          )}

          {jewelryDetails.materials === 'Silver' && (
            <div className="input-container-renamed">
              <label htmlFor="purity">Purity</label>
              <select
                id="purity"
                name="purity"
                value={jewelryDetails.purity}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Purity</option>
                {Object.keys(purity).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              {errors.purity && <span className="error-renamed">{errors.purity}</span>}
            </div>
          )}

          {jewelryDetails.materials === 'GoldDiamond' && (
            <>
              <div className="input-container-renamed">
                <label htmlFor="clarity">Clarity</label>
                <select
                  id="clarity"
                  name="clarity"
                  value={jewelryDetails.clarity}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Clarity</option>
                  {Object.keys(clarity).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
                {errors.clarity && <span className="error-renamed">{errors.clarity}</span>}
              </div>
              <div className="input-container-renamed">
                <label htmlFor="carat">Carat</label>
                <input type="text" name="carat" value={jewelryDetails.carat} onChange={handleInputChange} />
                {errors.carat && <span className="error-renamed">{errors.carat}</span>}
              </div>
            </>
          )}

          <label htmlFor="category">Category</label>
          <select name="category" value={jewelryDetails.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            {Object.keys(category).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
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
              <option value="ounces">oz</option>
            </select>
            {errors.weight && <span className="error-renamed">{errors.weight}</span>}
          </div>
          <button className="update-button-renamed" onClick={handleUpdateJewelry}>
            Update Jewelry
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewJewelryDetails;
