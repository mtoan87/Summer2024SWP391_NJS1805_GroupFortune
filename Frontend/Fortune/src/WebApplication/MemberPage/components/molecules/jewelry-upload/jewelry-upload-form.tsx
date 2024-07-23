import React, { useRef, useState, useEffect } from 'react';
import { message } from 'antd';
import './jewelry-upload-form.scss';
import api from '../../../../../config/axios';
import { useNavigate } from 'react-router-dom';

interface Jewelry {
  accountId: number;
  imageUrl: string;
  imageFile: File | null;
  name: string;
  materials: string;
  description: string;
  weight: string;
  weightUnit: string;
  goldage?: string;
  purity?: string;
  category: string;
  price: string;
  calculatedPrice?: string;
  clarity?: string;
  carat?: string;
}

const goldPricesPerOunce = {
  '24K': 1950,
  '22K': 1800,
  '18K': 1500,
  '14K': 1200,
  '10K': 900
};

const goldAges = {
  '24K': 'Gold24',
  '22K': 'Gold22',
  '18K': 'Gold18',
  '14K': 'Gold14'
};

const purity = {
  '92.5%': 'PureSilver925',
  '99.9%': 'PureSilver999',
  '90.0%': 'PureSilver900',
  '95.8%': 'PureSilver958'
};

const category = {
  'Ring': 'Ring',
  'Necklace': 'Necklace',
  'Bracelet': 'Bracelet',
  'Earrings': 'Earrings',
  'Pendant': 'Pendant',
  'Brooch': 'Brooch',
  'Anklet': 'Anklet',
  'Charm': 'Charm',
  'Clufflinks': 'Cufflinks',
  'Tiara': 'Tiara',
  'Diadem': 'Diadem',
  'Choker': 'Choker',
  'Bangle': 'Bangle',
  'Hairpin': 'Hairpin',
  'Barrette': 'Barrette',
  'Locket': 'Locket',
  'Signet Ring': 'SignetRing',
  'Stud Earrings': 'StudEarrings',
  'Hoop Earrings': 'HoopEarrings',
  'Cameo': 'Cameo',
  'Cluster Ring': 'ClusterRing',
  'Cocktail Ring': 'CocktailRing',
  'Cuff Bracelet': 'CuffBracelet'
}

const materials = {
  'Gold': 'Gold',
  'Silver': 'Silver',
  'Gold, Diamond': 'GoldDiamond'
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

const diamondPricesPerCarat = {
  FL: 8000,
  IF: 7000,
  VVS1: 6000,
  VVS2: 5000,
  VS1: 4000,
  VS2: 3000,
  SI1: 2000,
  SI2: 1000,
  I1: 500,
  I2: 300,
  I3: 100,
};
const silverPricesPerOunce = {
  '99.9%': { buying: 1950, selling: 2000 },
  '95.8%': { buying: 1910, selling: 1950 },
  '92.5%': { selling: 1820 },
  '90.0%': { selling: 1450 }
};

const convertToOunces = (weight: number, unit: string) => {
  const conversionRates = {
    grams: 0.035274,
    ounces: 1,
  };
  return weight * conversionRates[unit];
};

const JewelryUploadForm: React.FC = () => {
  const loginedUserString = sessionStorage.getItem('loginedUser');
  const [accountId, setAccountId] = useState<number>(0);
  const navigate = useNavigate();


  const [jewelry, setJewelry] = useState<Jewelry>({
    accountId: 0,
    imageUrl: '',
    imageFile: null,
    name: '',
    materials: '',
    description: '',
    weight: '',
    weightUnit: 'grams',
    category: '',
    price: '',
    calculatedPrice: ''
  });

  // GET ACCOUNT ID FROM SESSION
  useEffect(() => {
    const loginedUser = JSON.parse(loginedUserString);
    setAccountId(loginedUser?.accountId || null);

    setJewelry({
      ...jewelry,
      accountId: accountId
    })
  }, [])

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!jewelry.imageFile) newErrors.imageFile = 'Image is required';

    if (!jewelry.name) {
      newErrors.name = 'Name is required';
    } else if (jewelry.name[0] !== jewelry.name[0].toUpperCase()) {
      newErrors.name = 'Name must start with a capital letter';
    } else if (jewelry.name.length <= 4) {
      newErrors.name = 'Name must be longer than 4 letters';
    }

    if (!jewelry.materials) newErrors.materials = 'Materials is required';

    if (!jewelry.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(parseFloat(jewelry.weight)) || parseFloat(jewelry.weight) <= 0) {
      newErrors.weight = 'Weight must be a positive number';
    }

    if (jewelry.materials === 'Gold') {
      if (!jewelry.goldage) {
        newErrors.goldage = 'Gold Age is required';
      }
    } else if (jewelry.materials === 'Silver') {
      if (!jewelry.purity) {
        newErrors.purity = 'Purity is required';
      }
    } else if (jewelry.materials === 'Gold, Diamond') {
      if (!jewelry.goldage) {
        newErrors.goldage = 'Gold Age is required';
      }
      if (!jewelry.clarity) {
        newErrors.clarity = 'Clarity is required';
      }
      if (!jewelry.carat) {
        newErrors.carat = 'Carat is required';
      }
    }

    if (!jewelry.category) newErrors.category = 'Category is required';

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJewelry({
      ...jewelry,
      [name]: value
    });
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setJewelry(prevState => ({
          ...prevState,
          imageUrl: reader.result as string,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const logFormData = (formData: FormData) => {
    console.log('Form Data:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  };


  const calculatePrice = () => {
    const weightInOunces = convertToOunces(parseFloat(jewelry.weight), jewelry.weightUnit);

    if (jewelry.materials === 'Gold') {
      const pricePerOunce = goldPricesPerOunce[jewelry.goldage || ''];
      if (!pricePerOunce) return;

      const calculatedPrice = weightInOunces * pricePerOunce;
      setJewelry((prevState) => ({
        ...prevState,
        calculatedPrice: calculatedPrice.toFixed(2)
      }));
    } else if (jewelry.materials === 'Silver') {
      const silverDetails = silverPricesPerOunce[jewelry.purity || ''];
      const sellingPrice = silverDetails?.selling;
      if (!sellingPrice) return;

      const calculatedPrice = weightInOunces * sellingPrice;
      setJewelry((prevState) => ({
        ...prevState,
        calculatedPrice: calculatedPrice.toFixed(2)
      }));
    } else if (jewelry.materials === 'Gold, Diamond') {
      const goldPricePerOunce = goldPricesPerOunce[jewelry.goldage || ''];
      const diamondPricePerCarat = diamondPricesPerCarat[jewelry.clarity || ''];

      if (!goldPricePerOunce || !diamondPricePerCarat || !jewelry.carat) return;

      const goldPrice = weightInOunces * goldPricePerOunce;
      const diamondPrice = parseFloat(jewelry.carat) * diamondPricePerCarat;
      const calculatedPrice = goldPrice + diamondPrice;

      setJewelry((prevState) => ({
        ...prevState,
        calculatedPrice: calculatedPrice.toFixed(2)
      }));
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [
    jewelry.weight,
    jewelry.weightUnit,
    jewelry.goldage,
    jewelry.purity,
    jewelry.carat
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('accountId', String(accountId));
    formData.append('Name', jewelry.name);
    formData.append('materials', materials[jewelry.materials]);
    formData.append('description', jewelry.description);
    formData.append('weight', `${jewelry.weight} ${jewelry.weightUnit}`);
    formData.append('category', jewelry.category);
    formData.append('price', `${jewelry.price}`);
    if (jewelry.imageFile) {
      formData.append('jewelryImg', jewelry.imageFile);
    }

    if (jewelry.materials === 'Gold') {
      formData.append('goldage', goldAges[jewelry.goldage!]);
    } else if (jewelry.materials === 'Silver') {
      formData.append('purity', purity[jewelry.purity!]);
    } else if (jewelry.materials === 'Gold, Diamond') {
      formData.append('goldage', goldAges[jewelry.goldage!]);
      formData.append('clarity', clarity[jewelry.clarity!]);
      formData.append('carat', jewelry.carat!+"ct");
    }

    logFormData(formData);

    try {
      let apiEndpoint = '';
      if (jewelry.materials === 'Gold') {
        apiEndpoint = '/api/JewelryGold/CreateJewelryGold';
      } else if (jewelry.materials === 'Silver') {
        apiEndpoint = '/api/JewelrySilver/CreateSilverJewelry';
      } else if (jewelry.materials === 'Gold, Diamond') {
        apiEndpoint = '/api/JewelryGoldDia/CreateJewelryGoldDiamond';
      }

      await api.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      message.success('Jewelry uploaded successfully!');
      setJewelry({
        accountId: accountId,
        imageUrl: '',
        imageFile: null,
        name: '',
        materials: '',
        description: '',
        weight: '',
        weightUnit: 'grams',
        category: '',
        price: '',
        calculatedPrice: ''
      });
      navigate('/userJewel')
      setErrors({});
    } catch (error) {
      console.error('Error uploading jewelry', error);
      message.error('Error uploading jewelry. Please try again.');
    }
  };

  return (
    <div className="jewelry-upload-container">
      <form onSubmit={handleSubmit}>
        <h3>Upload a Jewelry</h3>
        <div className="form-content">
          <div className="image-upload-section">
            <label htmlFor="image">Image</label>
            <div className="upload-label-details">
              {jewelry.imageUrl ? (
                <img src={jewelry.imageUrl} alt="jewelry_image" />
              ) : (
                <button className='submit-image' onClick={handleImageClick}>Uploads image</button>
              )}
              <input ref={fileInputRef} type="file" id="image" name="image" onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
            </div>
            {errors.imageFile && <span className="error text-danger">{errors.imageFile}</span>}
          </div>
          <div className="form-fields-section">
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={jewelry.name}
                onChange={handleChange}
                required
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={jewelry.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {Object.values(category).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <span className="error">{errors.category}</span>}
            </div>
            <div>
              <label htmlFor="materials">Materials:</label>
              <select
                id="materials"
                name="materials"
                value={jewelry.materials}
                onChange={handleChange}
                required
              >
                <option value="">Select Material</option>
                <option value="Gold">Gold</option>
                <option value="Silver">Silver</option>
                <option value="Gold, Diamond">Gold, Diamond</option>
              </select>
              {errors.materials && <span className="error">{errors.materials}</span>}
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={jewelry.description}
                onChange={handleChange}
              />
              {errors.description && <span className="error">{errors.description}</span>}
            </div>
            <label htmlFor="weight">Weight:</label>
            <div className="input-container">
              <input
                type="text"
                id="weight"
                name="weight"
                value={jewelry.weight}
                onChange={handleChange}
                required
              />
              <select
                className="weight-unit-select-upload"
                name="weightUnit"
                value={jewelry.weightUnit}
                onChange={handleChange}
              >
                <option value="grams">Grams (g)</option>
                <option value="ounces">Ounces (oz)</option>
              </select>
              {errors.weight && <span className="error">{errors.weight}</span>}
            </div>
            <div className="note">
              <span color='red'>*1 Ounces (oz) = 31,1034768 grams</span>
            </div>
            {jewelry.materials === 'Gold' && (
              <>
                <label htmlFor="goldage">Gold Age:</label>
                <div className="input-container">
                  <select
                    id="goldage"
                    name="goldage"
                    value={jewelry.goldage}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gold Age</option>
                    <option value="24K">24K</option>
                    <option value="22K">22K</option>
                    <option value="18K">18K</option>
                    <option value="14K">14K</option>
                  </select>
                  {errors.goldage && <span className="error">{errors.goldage}</span>}
                </div>
              </>
            )}
            {jewelry.materials === 'Silver' && (
              <>
                <label htmlFor="purity">Purity:</label>
                <div className="input-container">
                  <select
                    id="purity"
                    name="purity"
                    value={jewelry.purity}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Purity</option>
                    <option value="92.5%">92.5%</option>
                    <option value="99.9%">99.9%</option>
                    <option value="90.0%">90.0%</option>
                    <option value="95.8%">95.8%</option>
                  </select>
                  {errors.purity && <span className="error">{errors.purity}</span>}
                </div>
              </>
            )}
            {jewelry.materials === 'Gold, Diamond' && (
              <>
                <label htmlFor="goldage">Gold Age:</label>
                <div className="input-container">
                  <select
                    id="goldage"
                    name="goldage"
                    value={jewelry.goldage}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gold Age</option>
                    <option value="24K">24K</option>
                    <option value="22K">22K</option>
                    <option value="18K">18K</option>
                    <option value="14K">14K</option>
                  </select>
                  {errors.goldage && <span className="error">{errors.goldage}</span>}
                </div>
                <label htmlFor="clarity">Clarity:</label>
                <div className="input-container">
                  <select
                    id="clarity"
                    name="clarity"
                    value={jewelry.clarity}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Clarity</option>
                    <option value="FL">FL</option>
                    <option value="IF">IF</option>
                    <option value="VVS1">VVS1</option>
                    <option value="VVS2">VVS2</option>
                    <option value="VS1">VS1</option>
                    <option value="VS2">VS2</option>
                    <option value="SI1">SI1</option>
                    <option value="SI2">SI2</option>
                    <option value="I1">I1</option>
                    <option value="I2">I2</option>
                    <option value="I3">I3</option>
                  </select>
                  {errors.clarity && <span className="error">{errors.clarity}</span>}
                </div>
                <label htmlFor="carat">Carat:</label>
                <div className="input-container">
                  <input
                    type="text"
                    id="carat"
                    name="carat"
                    value={jewelry.carat}
                    onChange={handleChange}
                    required
                  />
                  {errors.carat && <span className="error">{errors.carat}</span>}
                </div>
              </>
            )}
            <div className="calculated-price">
              Calculated Price: {jewelry.calculatedPrice} $
            </div>
            <button type="submit">Upload Jewelry</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JewelryUploadForm;
