import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../../../../../config/axios';

interface Jewelry {
  accountId: number;
  imageUrl: string;
  imageFile: File | null;
  name: string;
  materials: string;
  description: string;
  weight: string;
  purity: string;
  collection: string;
  price: string;
}

const SilverJewelryForm: React.FC<{ accountId: number }> = ({ accountId }) => {
  const [jewelry, setJewelry] = useState<Jewelry>({
    accountId: accountId,
    imageUrl: '',
    imageFile: null,
    name: '',
    materials: 'Silver',
    description: '',
    weight: '',
    purity: '',
    collection: '',
    price: ''
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!jewelry.name) newErrors.name = 'Name is required';
    if (!jewelry.description) newErrors.description = 'Description is required';

    if (!jewelry.weight) {
      newErrors.weight = 'Weight is required';
    } else if (isNaN(parseFloat(jewelry.weight))) {
      newErrors.weight = 'Weight must be a number';
    }

    if (!jewelry.purity) {
      newErrors.purity = 'Purity is required';
    } else if (isNaN(parseFloat(jewelry.purity))) {
      newErrors.purity = 'Purity must be a number';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('accountId', jewelry.accountId.toString());
    formData.append('name', jewelry.name);
    formData.append('materials', jewelry.materials);
    formData.append('description', jewelry.description);
    formData.append('weight', jewelry.weight);
    formData.append('purity', jewelry.purity);
    formData.append('collection', jewelry.collection);
    formData.append('price', jewelry.price);
    if (jewelry.imageFile) {
      formData.append('jewelryImg', jewelry.imageFile);
    }

    try {
      const response = await api.post('/api/JewelrySilver/CreateSilverJewelry', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Jewelry uploaded successfully', response.data);
      toast.success('Silver Jewelry uploaded successfully!');
      setJewelry({
        accountId: accountId,
        imageUrl: '',
        imageFile: null,
        name: '',
        materials: 'Silver',
        description: '',
        weight: '',
        purity: '',
        collection: '',
        price: ''
      });
      setErrors({});
    } catch (error) {
      console.error('Error uploading jewelry', error);
      toast.error('Error uploading jewelry. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
        <input type="text" id="name" name="name" value={jewelry.name} onChange={handleChange} required />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea id="description" name="description" value={jewelry.description} onChange={handleChange} required />
        {errors.description && <span className="error">{errors.description}</span>}
      </div>
      <div>
        <label htmlFor="weight">Weight:</label>
        <input type="text" id="weight" name="weight" value={jewelry.weight} onChange={handleChange} required />
        {errors.weight && <span className="error">{errors.weight}</span>}
      </div>
      <div>
        <label htmlFor="purity">Purity:</label>
        <input type="text" id="purity" name="purity" value={jewelry.purity} onChange={handleChange} required />
        {errors.purity && <span className="error">{errors.purity}</span>}
      </div>
      <div>
        <label htmlFor="collection">Collection:</label>
        <input type="text" id="collection" name="collection" value={jewelry.collection} onChange={handleChange} required />
        {errors.collection && <span className="error">{errors.collection}</span>}
      </div>
      <div>
        <label htmlFor="price">Price:</label>
        <input type="text" id="price" name="price" value={jewelry.price} onChange={handleChange} required />
        {errors.price && <span className="error">{errors.price}</span>}
      </div>
      <button type="submit">Upload Silver Jewelry</button>
    </form>
  );
};

export default SilverJewelryForm;
