import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../../../config/axios';
import './jewelryDetails.scss';
import 'react-toastify/dist/ReactToastify.css';
import ReactImageZoom from 'react-image-zoom';

function JewelryDetails() {
    const { id, material } = useParams();
    const [jewelry, setJewelry] = useState(null);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const purity = {
        PureSilver925: '92.5%',
        PureSilver999: '99.9%',
        PureSilver900: '90.0%',
        PureSilver958: '95.8%'
      };
      const goldAge = {
        Gold24: '24K',
        Gold22: '22K',
        Gold20: '20K',
        Gold18: '18K',
        Gold14: '14K'
      };
    useEffect(() => {
        const fetchJewelryDetails = async () => {
            try {
                let response;
                if (material === 'gold') {
                    response = await api.get(`api/JewelryGold/GetById/${id}`);
                } else if (material === 'silver') {
                    response = await api.get(`api/JewelrySilver/GetById/${id}`);
                } else if (material === 'goldDia') {
                    response = await api.get(`api/JewelryGoldDia/GetById/${id}`);
                }
                const jewelryData = response.data;
                console.log('Jewelry Details:', jewelryData);
                setJewelry(jewelryData);
            } catch (err) {
                console.error('Error fetching jewelry details:', err);
            }
        };

        fetchJewelryDetails();
    }, [id, material]);

    if (!jewelry) {
        return <div>Loading...</div>;
    }

    const zoomProps = {
        width: 500,
        height: 400,
        zoomWidth: 400,
        zoomHeight: 300,
        img: `https://localhost:44361/${jewelry.jewelryImg}`,
        zoomStyle: 'z-index: 100;'
    };

    return (
        <div className="jewelry-details-container">
            <h1>Jewelry Details</h1>
            <div className="jewelry-details-content">
                <div className="jewelry-image">
                    <ReactImageZoom {...zoomProps} />
                </div>
                <div className="jewelry-info">
                    <p><strong>Name:</strong> <h1 className=''>{jewelry.name}</h1></p>
                    <p><strong>Materials:</strong> {jewelry.materials}</p>
                    <p><strong>Description:</strong> {jewelry.description}</p>
                    <p><strong>Weight:</strong> {jewelry.weight}</p>
                    {material === 'gold' && <p><strong>Gold Age:</strong> {goldAge[jewelry.goldAge]}</p>}
                    {material === 'silver' && <p><strong>Purity:</strong> {purity[jewelry.purity]}</p>}
                    {material === 'goldDia' && (
                        <>
                            <p><strong>Gold Age:</strong> {goldAge[jewelry.goldAge]}</p>
                            <p><strong>Clarity:</strong> {jewelry.clarity}</p>
                            <p><strong>Carat:</strong> {jewelry.carat}</p>
                        </>
                    )}
                    <p><strong>Category:</strong> {jewelry.category}</p>
                    <p><strong>Price:</strong> ${jewelry.price}</p>
                </div>
            </div>
        </div>
    );
}

export default JewelryDetails;
