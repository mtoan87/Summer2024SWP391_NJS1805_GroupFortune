import React from 'react'

interface Jewelry {
    accountId: number;
    imageUrl: string;
    imageFile: File | null;
    name: string;
    materials: string;
    description: string;
    weight: string;
    goldage: string;
    clarity: string;
    carat: string;
    collection: string;
    price: string;
  }

function GoldDiamondJewelryForm() {
  return (
    <div>GoldDiamondJewelryForm</div>
  )
}

export default GoldDiamondJewelryForm