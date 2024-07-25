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
    collection: '',
    jewelryImg: '',
    clarity: '',
    carat: '',
    price: '',
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

  const goldAges = {
    '24K': 'Gold24',
    '22K': 'Gold22',
    '18K': 'Gold18',
    '14K': 'Gold14'
  };

  const category = {
    'Ring': 'Ring',
    'Necklace': 'Necklace', //- Vòng cổ
    'Bracelet': 'Bracelet', //- Vòng tay
    'Earrings': 'Earrings', //- Bông tai
    'Pendant': 'Pendant', //- Mặt dây chuyền
    'Brooch': 'Brooch', //- Trâm cài áo
    'Anklet': 'Anklet', //- Lắc chân
    'Charm': 'Charm', //- Mặt dây chuyền nhỏ (thường đeo trên vòng tay)
    'Clufflinks': 'Cufflinks', //- Khuy măng sét
    'Tiara': 'Tiara', //- Vương miện nhỏ
    'Diadem': 'Diadem', //- Vương miện
    'Choker': 'Choker', //- Vòng cổ sát cổ
    'Bangle': 'Bangle', //- Vòng tay cứng
    'Hairpin': 'Hairpin', // - Kẹp tóc
    'Barrette': 'Barrette', //- Kẹp tóc trang trí
    'Locket': 'Locket', //- Mặt dây chuyền có thể mở ra
    'Signet Ring': 'SignetRing', //- Nhẫn có dấu hiệu hoặc biểu tượng
    'Stud Earrings': 'StudEarrings', //- Bông tai đinh
    'Hoop Earrings': 'HoopEarrings', //- Bông tai vòng
    'Cameo': 'Cameo', //- Trang sức điêu khắc nổi
    'Cluster Ring': 'ClusterRing', //- Nhẫn đính nhiều viên đá quý nhỏ
    'Cocktail Ring': 'CocktailRing', //- Nhẫn to, thường có một viên đá quý lớn
    'Cuff Bracelet': 'CuffBracelet' //- Vòng tay bản lớn
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

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        let response;
        if (material === 'Gold') {
          response = await api.get(`/api/JewelryGold/GetById/${id}`);
        } else if (material === 'Gold, Diamond') {
          response = await api.get(`/api/JewelryGoldDia/GetById/${id}`);
        } else {
          response = await api.get(`/api/JewelrySilver/GetById/${id}`);
        }

        console.log('API response:', response.data);

        setJewelryDetails(prevState => ({
          ...prevState,
          ...response.data
        }));
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
    formData.append('Weight', `${jewelryDetails.weight}`);
    formData.append('Clarity', jewelryDetails.clarity);
    formData.append('Carat', jewelryDetails.carat);
    formData.append('Price', jewelryDetails.price);
    formData.append('Status', jewelryDetails.status);
    if (jewelryDetails.materials === 'Gold') {
      formData.append('GoldAge', jewelryDetails.goldAge);
    } else {
      // Ensure Purity is a valid enum value
      if (purity[jewelryDetails.purity!]) {
        formData.append('Purity', purity[jewelryDetails.purity!]);
      } else {
        setErrors(prevErrors => ({
          ...prevErrors,
          purity: 'Invalid Purity value'
        }));
        return;
      }
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
          : `/api/JewelryGoldDia/UpdateJewelryGoldDiamondManager?id=${id}`;

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
            <img
              className='item-img-renamed'
              src={`https://localhost:44361/${jewelryDetails.jewelryImg}`}
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
          <select name="materials" value={jewelryDetails.materials} onChange={handleInputChange}>
            <option value="">Select Material</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Diamond">Diamond</option>
          </select>
          {errors.materials && <span className="error-renamed">{errors.materials}</span>}

          {jewelryDetails.materials === 'Gold' && (
            <div className="input-container-renamed">
              <label htmlFor="goldAge">Gold Age</label>
              <select
                id="goldage"
                name="goldage"
                value={jewelryDetails.goldAge}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Gold Age</option>
                {Object.keys(goldAges).map(key => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>{errors.goldAge && <span className="error-renamed">{errors.goldAge}</span>}
              <span className="suffix-renamed">k</span>
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

          {jewelryDetails.materials === 'diamond' && (
            <>
              <div className="input-container-renamed">
                <label htmlFor="clarity">Clarity</label>
                <input type="text" name="clarity" value={jewelryDetails.clarity} onChange={handleInputChange} />
                {errors.clarity && <span className="error-renamed">{errors.clarity}</span>}
              </div>
              <div className="input-container-renamed">
                <label htmlFor="carat">Carat</label>
                <input type="text" name="carat" value={jewelryDetails.carat} onChange={handleInputChange} />
                {errors.carat && <span className="error-renamed">{errors.carat}</span>}
              </div>
              <div className="input-container-renamed">
                <label htmlFor="price">Price</label>
                <input type="text" name="price" value={jewelryDetails.price} onChange={handleInputChange} />
                {errors.price && <span className="error-renamed">{errors.price}</span>}
              </div>
            </>
          )}

          <label htmlFor="category">Category</label>
          <select name="category" value={jewelryDetails.category} onChange={handleInputChange}>
            <option value="">Select Category</option>
            <option value="Necklace">Necklace</option>
            <option value="Ring">Ring</option>
            <option value="Bracelet">Bracelet</option>
            <option value="Earrings">Earrings</option>
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

          <button className="update-button-renamed" onClick={handleUpdateJewelry}>
            Update Jewelry
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewJewelryDetails;
