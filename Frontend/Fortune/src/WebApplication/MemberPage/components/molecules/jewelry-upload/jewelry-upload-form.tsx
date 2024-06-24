import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './jewelry-upload-form.scss';
import api from '../../../../../config/axios';

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
}

const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
const accountId = loginedUser?.accountId;

const goldPricesPerOunce = {
  '24K': 1950,
  '22K': 1800,
  '18K': 1500,
  '14K': 1200,
  '10K': 900
};

const silverPricesPerOunce = {
  '99.99': { buying: 1950, selling: 2000 },
  '99.9': { buying: 1910, selling: 1950 },
  '92.5': { selling: 1820 },
  'plated': { selling: 1450 }
};

const convertToOunces = (weight: number, unit: string) => {
  const conversionRates = {
    grams: 0.035274,
    milligrams: 0.000035274,
    ounces: 1,
    pennyweights: 0.05
  };
  return weight * conversionRates[unit];
};

const JewelryUploadForm: React.FC = () => {
  const [jewelry, setJewelry] = useState<Jewelry>({
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    calculatePrice();
  }, [jewelry.weight, jewelry.weightUnit, jewelry.goldage, jewelry.purity]);

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
    const weight = parseFloat(jewelry.weight);
    if (!weight || isNaN(weight) || weight <= 0) return;

    const ounces = convertToOunces(weight, jewelry.weightUnit);
    let price = 0;

    if (jewelry.materials === 'Gold' && jewelry.goldage) {
      price = ounces * goldPricesPerOunce[jewelry.goldage as keyof typeof goldPricesPerOunce];
    } else if (jewelry.materials === 'Silver' && jewelry.purity) {
      const purityPrice = silverPricesPerOunce[jewelry.purity as keyof typeof silverPricesPerOunce];
      price = ounces * (purityPrice?.selling || 0);
    }

    setJewelry(prevState => ({
      ...prevState,
      calculatedPrice: price.toFixed(2)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('accountId', jewelry.accountId.toString());
    formData.append('Name', jewelry.name);
    formData.append('materials', jewelry.materials);
    formData.append('description', jewelry.description);
    formData.append('weight', `${jewelry.weight} ${jewelry.weightUnit}`);
      formData.append('Category', jewelry.category);
      formData.append('price', `${jewelry.price}`);
      console.log(jewelry.imageFile);
    if (jewelry.imageFile) {
      formData.append('jewelryImg', jewelry.imageFile);
    }

    if (jewelry.materials === 'Gold') {
      formData.append('goldage', `${jewelry.goldage!}k`);
    } else if (jewelry.materials === 'Silver') {
      formData.append('purity', `${jewelry.purity!}%`);
    }

    logFormData(formData);

    try {
      let apiEndpoint = '';
      if (jewelry.materials === 'Gold') {
        apiEndpoint = '/api/JewelryGold/CreateJewelryGold';
      } else if (jewelry.materials === 'Silver') {
        apiEndpoint = '/api/JewelrySilver/CreateSilverJewelry';
      }

      const response = await api.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Jewelry uploaded successfully', response.data);
      toast.success('Jewelry uploaded successfully!');
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
      setErrors({});
    } catch (error) {
      console.error('Error uploading jewelry', error);
      toast.error('Error uploading jewelry. Please try again.');
    }
  };

  return (
    <div className="jewelry-upload-container">
      <form onSubmit={handleSubmit}>
        <h3>Upload a Jewelry</h3>
        <div className="form-content">
          <div className="image-upload-section">
            <label htmlFor="image">Image</label>
            <div className="upload-label-details" onClick={handleImageClick}>
            <img 
              src={`https://localhost:44361/${jewelry.jewelryImg}`} 
              alt={jewelry.name} 
              onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
            />
              <div className="upload-text-details">Upload Image</div>
              <input ref={fileInputRef} type="file" id="image" name="image" onChange={handleImageUpload} accept="image/*" style={{ display: 'none' }} />
            </div>
            {errors.imageFile && <span className="error">{errors.imageFile}</span>}
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
                <option value="Necklace">Necklace</option>
                <option value="Ring">Ring</option>
                <option value="Bracelet">Bracelet</option>
                <option value="Earrings">Earrings</option>
                <option value="Brooch">Brooch</option>
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
                <option value="Diamond">Diamond</option>
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
                {/* <option value="carats">Carats (ct)</option> */}
                <option value="milligrams">Milligrams (mg)</option>
                <option value="ounces">Ounces (oz)</option>
                <option value="pennyweights">Pennyweights (dwt)</option>
              </select>
              {errors.weight && <span className="error">{errors.weight}</span>}
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
                    <option value="10K">10K</option>
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
                    <option value="99.99">99.99</option>
                    <option value="99.9">99.9</option>
                    <option value="92.5">92.5</option>
                    <option value="plated">Plated</option>
                  </select>
                  {errors.purity && <span className="error">{errors.purity}</span>}
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
      <ToastContainer />
    </div>
  );
};

export default JewelryUploadForm;
