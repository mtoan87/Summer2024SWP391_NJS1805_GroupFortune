import React, { useState } from 'react';
import api from '../../../../../config/axios';
import './jewelry-upload-form.scss'

interface Jewelry {
  accountId: number;
  name: string;
  materials: string;
  description: string;
  weight: string;
  goldage: string;
  collection: string;
}

const JewelryUploadForm: React.FC = () => {
  const [jewelry, setJewelry] = useState<Jewelry>({
    accountId: 4,
    name: '',
    materials: '',
    description: '',
    weight: '',
    goldage: '',
    collection: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJewelry({
      ...jewelry,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/Jewelries/CreateJewelry', jewelry);
      console.log('Jewelry uploaded successfully', response.data);
    } catch (error) {
      console.error('Error uploading jewelry', error);
    }
  };

  return (
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
      </div>
      <div>
        <label htmlFor="materials">Materials:</label>
        <input
          type="text"
          id="materials"
          name="materials"
          value={jewelry.materials}
          onChange={handleChange}
          required
        />
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
      </div>
      <button type="submit">Upload Jewelry</button>
    </form>
  );
};

export default JewelryUploadForm;
