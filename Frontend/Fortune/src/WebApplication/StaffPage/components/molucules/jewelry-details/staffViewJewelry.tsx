import { useEffect, useState } from 'react';
import './view-jewelry.scss'; // Assuming you have SCSS for styling
import api from '../../../../../config/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { message, Select, InputNumber, Button, Checkbox } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function StaffViewJewelry() {
  const [goldJewelry, setGoldJewelry] = useState([]);
  const [silverJewelry, setSilverJewelry] = useState([]);
  const [golddiaJewelry, setGoldDiaJewelry] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [disabledItems, setDisabledItems] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [goldAgeFilter, setGoldAgeFilter] = useState('');
  const [shipmentFilter, setShipmentFilter] = useState('');
  const [purityFilter, setPurityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [clarityFilter, setClarityFilter] = useState('');
  const [caratFilter, setCaratFilter] = useState('');
  const [activeGoldIds, setActiveGoldIds] = useState(new Set());
  const [activeSilverIds, setActiveSilverIds] = useState(new Set());
  const [activeGoldDiaIds, setActiveGoldDiaIds] = useState(new Set());
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const successMessage = state && state.successMessage;
  const purities = {
    'PureSilver925': '92.5%',
    'PureSilver999': '99.9%',
    'PureSilver900': '90.0%',
    'PureSilver958': '95.8%',
  };
  useEffect(() => {
    const fetchJewelryData = async () => {
      try {
        const [goldResponse, silverResponse, goldDiaResponse, auctionsResponse] = await Promise.all([
          api.get('/api/JewelryGold'),
          api.get('/api/JewelrySilver'),
          api.get('/api/JewelryGoldDia'),
          api.get('/api/Auctions/GetAllActiveAuctions')
        ]);
        const silverJewelry = silverResponse.data?.$values || [];

        // Map purity values using the purityMapping object
        const mappedSilverJewelry = silverJewelry.map(item => ({
          ...item,
          mappedPurity: purities[item.purity] || item.purity,
        }));
        console.log(mappedSilverJewelry);
        setSilverJewelry(mappedSilverJewelry);
        setGoldJewelry(goldResponse.data?.$values || []);
        setGoldDiaJewelry(goldDiaResponse.data?.$values || []);


        const activeAuctions = auctionsResponse.data?.$values || [];
        const goldIds = new Set();
        const silverIds = new Set();
        const goldDiaIds = new Set();

        activeAuctions.forEach(auction => {
          if (auction.jewelryGoldId) goldIds.add(auction.jewelryGoldId);
          if (auction.jewelrySilverId) silverIds.add(auction.jewelrySilverId);
          if (auction.jewelryGolddiaId) goldDiaIds.add(auction.jewelryGolddiaId);
        });
        setActiveGoldIds(goldIds);
        setActiveSilverIds(silverIds);
        setActiveGoldDiaIds(goldDiaIds);

      } catch (err) {
        console.error('Error fetching data', err);
        setGoldJewelry([]);
        setSilverJewelry([]);
        setGoldDiaJewelry([]);
        setActiveGoldIds(new Set());
        setActiveSilverIds(new Set());
        setActiveGoldDiaIds(new Set());
      }
    };

    if (accountId) {
      fetchJewelryData();
    } else {
      console.error('No accountId found in loginedUser');
    }
  }, [accountId]);

  useEffect(() => {
    if (successMessage) {
      message.success("Success Notification!");
    }
  }, [successMessage]);

  useEffect(() => {
    // Fetch all active auctions
    const fetchActiveAuctions = async () => {
      try {
        const response = await api.get('api/Auctions/GetAllActiveAuctions');
        setActiveAuctions(response.data);
        // Extract IDs of jewelry items from active auctions
        const activeJewelryIds = new Set();
        response.data.forEach(auction => {
          if (auction.jewelryGoldId) activeJewelryIds.add(auction.jewelryGoldId);
          if (auction.jewelrySilverId) activeJewelryIds.add(auction.jewelrySilverId);
          if (auction.jewelryGoldDiaId) activeJewelryIds.add(auction.jewelryGoldDiaId);
        });
        console.log('Active Jewelry IDs:', Array.from(activeJewelryIds));
        setDisabledItems(activeJewelryIds);
      } catch (error) {
        console.error('Error fetching active auctions', error);
      }
    };

    fetchActiveAuctions();
  }, []);


  const handleUpdateJewelry = (jewelryId, material) => {
    navigate(`/staff/update-jewelry/${jewelryId}/${material}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGoldAgeChange = (value) => {
    setGoldAgeFilter(value);
  };
  const handleShipmentChange = (value) => {
    setShipmentFilter(value);
  };
  const handlePurityChange = (value) => {
    setPurityFilter(value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const handleMaterialChange = (value) => {
    setMaterialFilter(value);
  };

  const value = caratFilter ? parseFloat(caratFilter) : null;
  const handleCaratChange = (value) => {
    setCaratFilter(value ? `${value}ct` : '');
  };
  const handleClarityChange = (value) => {
    setClarityFilter(value);
  };
  const clearFilters = () => {
    setGoldAgeFilter('');
    setPurityFilter('');
    setCategoryFilter('');
    setMaterialFilter('');
    setClarityFilter('');
    setCaratFilter('');
    setSearchQuery('');
    setShipmentFilter('');
  };

  const filterJewelry = (jewelry) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const isGoldAgeMatch = !goldAgeFilter || jewelry.goldAge === goldAgeFilter;
    const isPurityMatch = !purityFilter || jewelry.purity === purityFilter;
    const isCategoryMatch = !categoryFilter || jewelry.category === categoryFilter;
    const isMaterialMatch = !materialFilter || (jewelry.materials && jewelry.materials.toLowerCase().includes(materialFilter.toLowerCase()));
    const isShipmentMatch = !shipmentFilter || jewelry.shipment === shipmentFilter;
    const isClarityMatch = !clarityFilter || jewelry.clarity === clarityFilter;
    const isCaratMatch = !caratFilter || jewelry.carat === caratFilter;
    return (
      (jewelry.name && jewelry.name.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.description && jewelry.description.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.collection && jewelry.collection.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.goldAge && jewelry.goldAge.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.materials && jewelry.materials.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.shipment && jewelry.shipment.toLowerCase().includes(lowerCaseQuery))

    ) && isGoldAgeMatch && isPurityMatch && isCategoryMatch && isMaterialMatch && isClarityMatch && isShipmentMatch && isCaratMatch;
  };



  // const handleDeliveryStatusChange = async (jewelryId, material, isChecked) => {
  //   const endpoint = material === 'Gold'
  //     ? `/api/JewelryGold/UpdateJewelryGoldStaff?id=${jewelryId}`
  //     : (material === 'GoldDia'
  //       ? `/api/JewelryGoldDia/UpdateJewelryGoldDiamondStaff?id=${jewelryId}`
  //       : `/api/JewelrySilver/UpdateJewelrySilverStaff?id=${jewelryId}`);

  //   try {
  //     const response = await api.put(endpoint, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     message.success('Delivery status updated successfully');
  //   } catch (error) {
  //     console.error('Error updating delivery status', error);
  //     message.error('Failed to update delivery status');
  //   }
  // };
  const purityMapping = {
    '92.5%': 'PureSilver925',
    '99.9%': 'PureSilver999',
    '90.0%': 'PureSilver900',
    '95.8%': 'PureSilver958',
  };
  const handleFormSubmit = async (jewelryId, name, description, category, clarity, purity, carat, goldAge, material, weight, price, isChecked) => {
    const formData = new FormData();
    const convertedPurity = purityMapping[purity] || purity;
    formData.append('jewelryId', jewelryId);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('goldAge', goldAge);
    formData.append('clarity', clarity);
    formData.append('carat', carat);
    formData.append('materials', material);
    formData.append('weight', weight);
    formData.append('price', price);
    formData.append('purity', convertedPurity);
    console.log(isChecked, convertedPurity);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    if (isChecked) {
      formData.append('shipment', 'Deliveried');
    } else {

      formData.append('shipment', 'Delivering');
    }
    try {
      const endpoint = material === 'Gold'
        ? `/api/JewelryGold/UpdateJewelryGoldStaff?id=${jewelryId}`
        : (material === 'GoldDiamond'
          ? `/api/JewelryGoldDia/UpdateJewelryGoldDiamondStaff?id=${jewelryId}`
          : `/api/JewelrySilver/UpdateJewelrySilverStaff?id=${jewelryId}`);

      console.log("Endpoint:", endpoint);
      console.log("FormData:", Array.from(formData.entries()));

      const response = await api.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("API Response Status:", response.status);
      console.log("API Response Data:", response.data);
      setTimeout(() => {
        window.location.reload();
      }, 1000)
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
    <>
      <div className="jewel-content">
        <h1>Jewelry</h1>
      </div>
      <div className='searchBar'>
        <div className="fui-input-label-animation">
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder='Search for Jewelry'
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="filters">
        <InputNumber
          placeholder="Enter Carat"
          onChange={handleCaratChange}
          value={value}
          className="filter-item"
          min={0} // Set minimum value if needed
          step={0.1} // Adjust step if needed (e.g., 0.1 for decimal precision)
        />
        <Select
          placeholder="Select Clarity"
          onChange={handleClarityChange}
          allowClear
          className="filter-item"
          value={clarityFilter || undefined}
        >
          <Option value="FL">FL</Option>
          <Option value="IF">IF</Option>
          <Option value="VVS1">VVS1</Option>
          <Option value="VVS2">VVS2</Option>
          <Option value="VS1">VS1</Option>
          <Option value="VS2">VS2</Option>
          <Option value="SI1">SI1</Option>
          <Option value="SI2">SI2</Option>
          <Option value="I1">I1</Option>
          <Option value="I2">I2</Option>
          <Option value="I3">I3</Option>
        </Select>
        <Select
          placeholder="Select Gold Age"
          onChange={handleGoldAgeChange}
          allowClear
          className="filter-item"
          value={goldAgeFilter || undefined}  // Ensure placeholder shows when goldAgeFilter is empty
        >
          <Option value="Gold14">14K</Option>
          <Option value="Gold18">18K</Option>
          <Option value="Gold20">20K</Option>
          <Option value="Gold22">22K</Option>
          <Option value="Gold24">24K</Option>
        </Select>
        <Select
          placeholder="Select Purity"
          onChange={handlePurityChange}
          allowClear
          className="filter-item"
          value={purityFilter || undefined}  // Ensure placeholder shows when purityFilter is empty
        >
          <Option value="PureSilver925">92.5%</Option>
          <Option value="PureSilver999%">99.9%</Option>
          <Option value="PureSilver900">90%</Option>
          <Option value="PureSilver958%">95.8%</Option>
        </Select>
        <Select
          placeholder="Select Category"
          onChange={handleCategoryChange}
          allowClear
          className="filter-item"
          value={categoryFilter || undefined}  // Ensure placeholder shows when categoryFilter is empty
        >
          <Option value="Ring">Ring</Option>
          <Option value="Necklace">Necklace</Option>
          <Option value="Bracelet">Bracelet</Option>
          <Option value="Earrings">Earrings</Option>
          <Option value="Pendant">Pendant</Option>
          <Option value="Brooch">Brooch</Option>
          <Option value="Anklet">Anklet</Option>
          <Option value="Charm">Charm</Option>
          <Option value="Cufflinks">Cufflinks</Option>
          <Option value="Tiara">Tiara</Option>
          <Option value="Diadem">Diadem</Option>
          <Option value="Choker">Choker</Option>
          <Option value="Bangle">Bangle</Option>
          <Option value="Hairpin">Hairpin</Option>
          <Option value="Barrette">Barrette</Option>
          <Option value="Locket">Locket</Option>
          <Option value="SignetRing">Signet Ring</Option>
          <Option value="StudEarrings">Stud Earrings</Option>
          <Option value="HoopEarrings">Hoop Earrings</Option>
          <Option value="Cameo">Cameo</Option>
          <Option value="ClusterRing">Cluster Ring</Option>
          <Option value="CocktailRing">Cocktail Ring</Option>
          <Option value="CuffBracelet">Cuff Bracelet</Option>

        </Select>
        <Select
          placeholder="Select Shipment status"
          onChange={handleShipmentChange}
          allowClear
          className="filter-item"
          value={shipmentFilter || undefined}  // Ensure placeholder shows when goldAgeFilter is empty
        >
          <Option value="Deliveried">Deliveried</Option>
          <Option value="Delivering">Delivering</Option>
        </Select>
        <Select
          placeholder="Select Material"
          onChange={handleMaterialChange}
          allowClear
          className="filter-item"
          value={materialFilter || undefined}  // Ensure placeholder shows when materialFilter is empty
        >
          <Option value="Gold">Gold</Option>
          <Option value="Silver">Silver</Option>
          <Option value="Diamond">Gold Diamond</Option>
        </Select>
        <Button
          onClick={clearFilters}
          className="filter-item"
        >
          Clear Filters
        </Button>
      </div>
      <div className="jewelry-container">
        {/* Render gold jewelry items */}
        {goldJewelry.length > 0 && (
          goldJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelryGoldId} className="jewelry-item">
              <img
                className='item-img'
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Gold Age: {jewelry.goldAge.replace('Gold', '')}k</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price !== null ? `${jewelry.price}$` : 'Appraising'}</p>
              <p>Shipment: {jewelry.shipment}</p>
              {activeGoldIds.has(jewelry.jewelryGoldId) && <p className="active-auction-message">This item is currently in an active auction.</p>}
              <div className="jewelry-item-buttons">
                <button onClick={() => handleUpdateJewelry(jewelry.jewelryGoldId, "Gold")}
                  disabled={jewelry.shipment === 'Deliveried'}
                  className={jewelry.shipment === 'Deliveried' ? 'button-disabled' : ''}>
                  <EditOutlined /> Appraise
                </button>
                <Checkbox
                  defaultChecked={jewelry.shipment === 'Deliveried'}
                  onChange={(e) => handleFormSubmit(
                    jewelry.jewelryGoldId,
                    jewelry.name,
                    jewelry.description,
                    jewelry.category,
                    null,
                    null,
                    null,
                    jewelry.goldAge,
                    `Gold`,
                    jewelry.weight,
                    jewelry.price,
                    e.target.checked)}
                  disabled={activeGoldIds.has(jewelry.jewelryGoldId) || jewelry.price === undefined}
                >
                  Delivered
                </Checkbox>
              </div>
            </div>
          ))
        )}
        {/* Render silver jewelry items */}
        {silverJewelry.length > 0 && (
          silverJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelrySilverId} className="jewelry-item">
              <img
                className='item-img'
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Purity: {jewelry.mappedPurity}</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price !== null ? `${jewelry.price}$` : 'Appraising'}</p>
              <p>Shipment: {jewelry.shipment}</p>
              {activeSilverIds.has(jewelry.jewelrySilverId) && <p className="active-auction-message">This item is currently in an active auction.</p>}
              <div className="jewelry-item-buttons">
                <button onClick={() => handleUpdateJewelry(jewelry.jewelrySilverId, "Silver")}
                  disabled={jewelry.shipment === 'Deliveried'}
                  className={jewelry.shipment === 'Deliveried' ? 'button-disabled' : ''}>
                  <EditOutlined /> Appraise
                </button>
                <Checkbox
                  defaultChecked={jewelry.shipment === 'Deliveried'}
                  onChange={(e) => handleFormSubmit(
                    jewelry.jewelrySilverId,
                    jewelry.name,
                    jewelry.description,
                    jewelry.category,
                    null,
                    jewelry.purity,
                    null,
                    null,
                    `Silver`,
                    jewelry.weight,
                    jewelry.price,
                    e.target.checked)}
                  disabled={activeSilverIds.has(jewelry.jewelrySilverId) || jewelry.price === undefined}
                >
                  Delivered
                </Checkbox>
              </div>
            </div>
          ))
        )}
        {/* Render gold dia jewelry items */}
        {golddiaJewelry.length > 0 && (
          golddiaJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelryGoldDiaId} className="jewelry-item">
              <img
                className='item-img'
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Gold Age: {jewelry.goldAge.replace('Gold', '')}k</p>
              <p>Clarity: {jewelry.clarity}</p>
              <p>Carat: {jewelry.carat}</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price !== undefined ? `${jewelry.price}$` : 'Appraising'}</p>
              <p>Shipment: {jewelry.shipment}</p>
              {activeGoldDiaIds.has(jewelry.jewelryGolddiaId) && <p className="active-auction-message">This item is currently in an active auction.</p>}
              <div className="jewelry-item-buttons">
                <button onClick={() => handleUpdateJewelry(jewelry.jewelryGolddiaId, "GoldDia")}
                  disabled={jewelry.shipment === 'Deliveried'}
                  className={jewelry.shipment === 'Deliveried' ? 'button-disabled' : ''}>
                  <EditOutlined /> Appraise
                </button>
                {/* <Checkbox
              checked={jewelry.delivered}
              onChange={(e) => handleDeliveryStatusChange(jewelry.jewelryGoldDiaId, 'GoldDia', e.target.checked)}
            >
              Delivered
            </Checkbox> */}
                <Checkbox
                  defaultChecked={jewelry.shipment === 'Deliveried'}
                  onChange={(e) => handleFormSubmit(
                    jewelry.jewelryGolddiaId,
                    jewelry.name,
                    jewelry.description,
                    jewelry.category,
                    jewelry.clarity,
                    jewelry.carat,
                    null,
                    jewelry.goldAge,
                    `GoldDiamond`,
                    jewelry.weight,
                    jewelry.price,
                    e.target.checked)
                  }
                  disabled={activeGoldDiaIds.has(jewelry.jewelryGolddiaId) || jewelry.price === undefined}
                >
                  Delivered
                </Checkbox>
              </div>
            </div>
          ))
        )}
        {!(goldJewelry.length > 0 || silverJewelry.length > 0 || golddiaJewelry.length > 0) && (
          <div className="no-results">
            <p>No jewelry found.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default StaffViewJewelry;
