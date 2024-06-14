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
  goldage?: string;  // Optional for Silver
  purity?: string;   // Optional for Gold
  collection: string;
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
    collection: '',
    price: ''
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!jewelry.name) newErrors.name = 'Name is required';
    if (!jewelry.materials) newErrors.materials = 'Materials is required';
    if (!jewelry.description) newErrors.description = 'Description is required';

    if (!jewelry.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(parseFloat(jewelry.weight))) {
      newErrors.weight = 'Weight must be a number';
    }

    if (jewelry.materials === 'Gold') {
      if (!jewelry.goldage) {
        newErrors.goldage = 'Gold Age is required';
      } else if (!Number.isInteger(Number(jewelry.goldage))) {
        newErrors.goldage = 'Gold Age must be an integer';
      }
    } else if (jewelry.materials === 'Silver') {
      if (!jewelry.purity) {
        newErrors.purity = 'Purity is required';
      } else if (isNaN(parseFloat(jewelry.purity))) {
        newErrors.purity = 'Purity must be a number';
      }
    }

    if (!jewelry.collection) newErrors.collection = 'Collection is required';

    if (!jewelry.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(jewelry.price))) {
      newErrors.price = 'Price must be a number';
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
    formData.append('weight', jewelry.weight);
    formData.append('Category', jewelry.collection);
    formData.append('price', jewelry.price);
    if (jewelry.imageFile) {
      formData.append('jewelryImg', jewelry.imageFile); // Ensure the key matches the API requirement
    }

    let apiEndpoint = '';
    if (jewelry.materials === 'Gold') {
      formData.append('goldage', jewelry.goldage!);
      apiEndpoint = 'api/JewelryGold/CreateJewelryGold';
    } else if (jewelry.materials === 'Silver') {
      formData.append('purity', jewelry.purity!);
      apiEndpoint = '/api/JewelrySilver/CreateSilverJewelry';
    }

    // Log the form data
    logFormData(formData);

    try {
      let apiEndpoint = '';
      if (jewelry.materials === 'Gold') {
        apiEndpoint = '/api/JewelryGold/CreateJewelryGold';
      } else if (jewelry.materials === 'Silver') {
        // Adjust for Silver if needed
        apiEndpoint = '/api/JewelrySilver/CreateSilverJewelry';
      }

      const response = await api.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Jewelry uploaded successfully', response.data);
      toast.success('Jewelry uploaded successfully!');
      // Reset form state after successful upload
      setJewelry({
        accountId: accountId,
        jewelryImg: null,
        name: '',
        materials: '',
        description: '',
        weight: '',
        price: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error uploading jewelry', error);
      toast.error('Error uploading jewelry. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Jewelry</h3>
        <div>
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
        </div>
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
            required
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>
        <div>
          <label htmlFor="weight">Weight:</label>
          <input
            type="text"
            id="weight"
            name="weight"
            value={jewelry.weight}
            onChange={handleChange}
            required
          />
          {errors.weight && <span className="error">{errors.weight}</span>}
        </div>
        {jewelry.materials === 'Gold' && (
          <div>
            <label htmlFor="goldage">Gold Age:</label>
            <input
              type="text"
              id="goldage"
              name="goldage"
              value={jewelry.goldage}
              onChange={handleChange}
              required
            />
            {errors.goldage && <span className="error">{errors.goldage}</span>}
          </div>
        )}
        {jewelry.materials === 'Silver' && (
          <div>
            <label htmlFor="purity">Purity:</label>
            <input
              type="text"
              id="purity"
              name="purity"
              value={jewelry.purity}
              onChange={handleChange}
              required
            />
            {errors.purity && <span className="error">{errors.purity}</span>}
          </div>
        )}
        <div>
          <label htmlFor="collection">Collection:</label>
          <input
            type="text"
            id="collection"
            name="collection"
            value={jewelry.collection}
            onChange={handleChange}
            required
          />
          {errors.collection && <span className="error">{errors.collection}</span>}
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="text"
            id="price"
            name="price"
            value={jewelry.price}
            onChange={handleChange}
            required
          />
          {errors.price && <span className="error">{errors.price}</span>}
        </div>
        <button type="submit">Upload Jewelry</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default JewelryUploadForm;
