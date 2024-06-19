import React, { useRef, useState } from 'react';
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
}

const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
const accountId = loginedUser?.accountId;

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
    price: ''
  });

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
      } else if (isNaN(parseFloat(jewelry.goldage)) || parseFloat(jewelry.goldage) <= 0) {
        newErrors.goldage = 'Gold Age must be a positive number';
      }
    } else if (jewelry.materials === 'Silver') {
      if (!jewelry.purity) {
        newErrors.purity = 'Purity is required';
      } else if (isNaN(parseFloat(jewelry.purity)) || parseFloat(jewelry.purity) <= 0) {
        newErrors.purity = 'Purity must be a positive number';
      }
    }

    if (!jewelry.category) newErrors.category = 'Category is required';

    if (!jewelry.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(jewelry.price)) || parseFloat(jewelry.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

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
        price: ''
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
        <h3>Create a Jewelry</h3>
        <div className="form-content">
          <div className="image-upload-section">
            <label htmlFor="image">Image</label>
            <div className="upload-label-details" onClick={handleImageClick}>
              <img
                src={jewelry.imageUrl || "../../../../../../src/assets/img/jewelry_introduction.jpg"}
                alt="jewelry"
                className="upload-preview"
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
                <option value="Platinum">Platinum</option>
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
            <div className="input-container">
              <label htmlFor="weight">Weight:</label>
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
              <div className="input-container">
                <label htmlFor="goldage">Gold Age:</label>
                <input
                  type="text"
                  id="goldage"
                  name="goldage"
                  value={jewelry.goldage}
                  onChange={handleChange}
                  required
                />
                <span className="suffix">k</span>
                {errors.goldage && <span className="error">{errors.goldage}</span>}
              </div>
            )}
            {jewelry.materials === 'Silver' && (
              <div className="input-container">
                <label htmlFor="purity">Purity:</label>
                <input
                  type="text"
                  id="purity"
                  name="purity"
                  value={jewelry.purity}
                  onChange={handleChange}
                  required
                />
                <span className="suffix">%</span>
                {errors.purity && <span className="error">{errors.purity}</span>}
              </div>
            )}
            <div className="input-container">
              <label htmlFor="price">Price:</label>
              <input
                type="text"
                id="price"
                name="price"
                value={jewelry.price}
                onChange={handleChange}
                required
              />
              <span className="suffix">$</span>
              {errors.price && <span className="error">{errors.price}</span>}
            </div>
            <button type="submit">Create Jewelry</button>
          </div>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default JewelryUploadForm;
