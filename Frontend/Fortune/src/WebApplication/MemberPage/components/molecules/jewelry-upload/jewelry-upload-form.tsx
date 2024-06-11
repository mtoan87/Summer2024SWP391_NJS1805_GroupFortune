import React, { useState } from 'react';
import api from '../../../../../config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './jewelry-upload-form.scss';

interface Jewelry {
  accountId: number;
  name: string;
  materials: string;
  description: string;
  weight: string;
  goldage: string;
  collection: string;
  price: string;
}

const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
const accountId = loginedUser?.accountId;

const JewelryUploadForm: React.FC = () => {
  const [jewelry, setJewelry] = useState<Jewelry>({
    accountId: accountId,
    name: '',
    materials: '',
    description: '',
    weight: '',
    goldage: '',
    collection: '',
    price: ''
  });

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
    
    if (!jewelry.goldage) {
      newErrors.goldage = 'Gold Age is required';
    } else if (!Number.isInteger(Number(jewelry.goldage))) {
      newErrors.goldage = 'Gold Age must be an integer';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      console.log(jewelry);
      const response = await api.post('/api/Jewelries/CreateJewelry', jewelry);
      console.log('Jewelry uploaded successfully', response.data);
      toast.success('Jewelry uploaded successfully!');
      // Clear form fields and errors upon successful submission
      setJewelry({
        accountId: accountId,
        name: '',
        materials: '',
        description: '',
        weight: '',
        goldage: '',
        collection: '',
        price: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error uploading jewelry', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Jewelry</h3>
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
