import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import api from '../../../../../config/axios';
import './update-jewelry.scss';
import { EditOutlined } from '@ant-design/icons';

const shipmentOptions = ["Delivering", "Deliveried"];

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
    clarity: '',
    carat: '',
    price: '',
    collection: '',
    jewelryImg: '',
    shipment: '',
    calculatePrice:null,
  });
  const [errors, setErrors] = useState({});
  const { id, material } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      if (!id) {
        console.error('Missing id');
        return;
      }
      console.log('ID:', id);
      console.log('Material:', material);
      try {
        let response;
        if (material === 'Gold') {
          response = await api.get(`/api/JewelryGold/GetById/${id}`);
        } else if (material === 'GoldDia') {
          response = await api.get(`/api/JewelryGoldDia/GetById/${id}`);
          console.log("Gold Diamond: ", response.data)
        } else {
          response = await api.get(`/api/JewelrySilver/GetById/${id}`);
        }
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

    // Call calculate price function when relevant fields change
    calculatePrice();
  };

  const calculatePrice = async () => {
    const { accountId, materials, weight, goldAge, purity, price, carat, clarity } = jewelryDetails;

    try {
      const response = await api.post('/api/Jewelries/CalculatePrice', {
        accountId,
        materials,
        weight: parseFloat(weight),
        weightUnit: 'grams',  // Assuming weight is in grams
        goldAge,
        purity,
        price: 0,
        carat: parseFloat(carat),
        clarity
      });

      console.log("Price Calculation Response:", response.data);
      setJewelryDetails(prevState => ({
        ...prevState,
        calculatePrice: response.data.calculatedPrice.toFixed(2)  // Assuming calculatedPrice is returned from API
      }));
    } catch (error) {
      console.error('Error calculating price:', error);
      // Handle error
    }
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
    formData.append('Price', jewelryDetails.calculatePrice);
    formData.append('jewelryImg', jewelryDetails.jewelryImg);
    formData.append('Shipment', jewelryDetails.shipment);

    if (material === 'Gold') {
      formData.append('GoldAge', jewelryDetails.goldAge);
    } else if (material === 'GoldDia') {
      formData.append('Clarity', jewelryDetails.clarity);
      formData.append('Carat', jewelryDetails.carat);
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
        : (material === 'GoldDia'
          ? `/api/JewelryGoldDia/UpdateJewelryGoldDiamondStaff?id=${id}`
          : `/api/JewelrySilver/UpdateJewelrySilverStaff?id=${id}`);

      console.log("Endpoint:", endpoint);
      console.log("FormData:", Array.from(formData.entries()));

      const response = await api.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Data:", response.data);

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
          
          <label htmlFor="weight">Weight</label>
          <input type="text" name="weight" value={jewelryDetails.weight} onChange={handleInputChange} disabled />

          {material === 'Gold' && (
            <>
              <label htmlFor="goldAge">Gold Age</label>
              <select name="goldAge" value={jewelryDetails.goldAge} onChange={handleInputChange} disabled>
                {Object.keys(GoldAgeMapping).map(key => (
                  <option key={key} value={key}>{GoldAgeMapping[key]}</option>
                ))}
              </select>
            </>
          )}

          {material === 'Silver' && (
            <>
              <label htmlFor="purity">Purity</label>
              <input type="text" name="purity" value={jewelryDetails.purity} onChange={handleInputChange} disabled/>
              {errors.purity && <span className="error">{errors.purity}</span>}
            </>
          )}

          {material === 'GoldDia' && (
            <>
              <label htmlFor="goldAge">Gold Age</label>
              <select name="goldAge" value={jewelryDetails.goldAge} onChange={handleInputChange} disabled>
                {Object.keys(GoldAgeMapping).map(key => (
                  <option key={key} value={key}>{GoldAgeMapping[key]}</option>
                ))}
              </select>
              <label htmlFor="clarity">Clarity</label>
              <input type="text" name="clarity" value={jewelryDetails.clarity} onChange={handleInputChange} disabled/>
              <label htmlFor="carat">Carat</label>
              <input type="text" name="carat" value={jewelryDetails.carat} onChange={handleInputChange} disabled/>
            </>
          )}

          <label htmlFor="price">Price</label>
          <div className="input-container">
            <input type="text" placeholder="Press to calculate." name="calculatedPrice" value={jewelryDetails.calculatePrice} onChange={handleInputChange} disabled/>
            <button onClick={calculatePrice}>Calculate Price</button>
          </div>
           {/* <label htmlFor="price">Price</label>
          <div className="input-container">
            <input type="text" name="price" value={jewelryDetails.price} onChange={handleInputChange} />
          </div> */}
          {errors.price && <span className="error">{errors.price}</span>}

          {/* <label htmlFor="shipment">Shipment</label>
          <select name="shipment" value={jewelryDetails.shipment} onChange={handleInputChange}>
            {shipmentOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select> */}

          <button 
          className={`update-jewelry ${jewelryDetails.calculatePrice === undefined ? 'disabled' : ''}`}
          onClick={handleUpdateJewelry}
           disabled={jewelryDetails.calculatePrice === undefined}
          ><EditOutlined /> Update</button>
        </div>
      </div>
    </div>
  );
}

export default StaffViewJewelryDetails;

