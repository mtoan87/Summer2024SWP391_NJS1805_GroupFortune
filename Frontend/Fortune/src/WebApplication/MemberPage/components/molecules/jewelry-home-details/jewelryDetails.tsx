import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../../../config/axios';
import './jewelryDetails.scss';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactImageZoom from 'react-image-zoom';

function JewelryDetails() {
    const { id } = useParams();
    const [jewelry, setJewelry] = useState(null);
    const storedUser = sessionStorage.getItem("loginedUser");
    const user = storedUser ? JSON.parse(storedUser) : null;

    useEffect(() => {
        const fetchJewelryDetails = async () => {
            try {
                const response = await api.get(`api/JewelryGold/GetById/${id}`);
                const jewelryData = response.data;
                console.log('Jewelry Details:', jewelryData);
                setJewelry(jewelryData);
            } catch (err) {
                console.error('Error fetching auction details:', err);
            }
        };

        fetchJewelryDetails();
    }, [id]);

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
                    <p><strong>Gold Age:</strong> {jewelry.goldAge}</p>
                    <p><strong>Category:</strong> {jewelry.category}</p>
                    <p><strong>Price:</strong> ${jewelry.price}</p>
                </div>
            </div>
        </div>
    );
}

export default JewelryDetails;
