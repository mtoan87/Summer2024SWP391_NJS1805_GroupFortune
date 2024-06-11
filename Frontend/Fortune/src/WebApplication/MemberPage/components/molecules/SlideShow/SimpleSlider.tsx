import React, { useState, useEffect, useRef } from 'react';
import './SimpleSlider.scss';

const sliderData = [
  {
    href: "",
    imgSrc: "https://cdn.pnj.io/images/promo/210/Tabsale_T6_chung-1972x640-cta.jpg",
    imgAlt: "Heaven Burns Red 第五章後編 開幕 2024.02.23",
  },
  {
    href: "",
    imgSrc: "https://cdn.pnj.io/images/promo/210/main-THANG_06_-_CT_CHILDRENS_DAY-1972x640__CTA_.jpg",
    imgAlt: "Heaven Burns Red 第四章後編 開幕 2023.04.28",
  },
  {
    href: "",
    imgSrc: "https://cdn.pnj.io/images/promo/196/egift-t12-23-1972x640CTA.jpg",
    imgAlt: "Heaven Burns Red 第四章前編 開幕 2022.07.29",
  },
  {
    href: "",
    imgSrc: "https://cdn.pnj.io/images/promo/199/pnjfast-t1-24-1972x640CTA.jpg",
    imgAlt: "Heaven Burns Red 第三章リリース開始 2022.02.28",
  },
  {
    href: "",
    imgSrc: "https://ijc.vn/vnt_upload/weblink/IJC_summer_call.jpg",
    imgAlt: "Heaven Burns Red 好評配信中",
  },
];

const SimpleSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideInterval = useRef(null);

  useEffect(() => {
    startAutoSlide();
    return () => {
      pauseAutoSlide();
    };
  }, [currentIndex]);

  const startAutoSlide = () => {
    slideInterval.current = setInterval(() => {
      showNextSlide();
    }, 6000); // Change slide every 6 seconds
  };

  const pauseAutoSlide = () => {
    clearInterval(slideInterval.current);
  };

  const showPrevSlide = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : sliderData.length - 1;
    setCurrentIndex(newIndex);
  };

  const showNextSlide = () => {
    const newIndex = currentIndex < sliderData.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
  };

  

  return (
    <div className="ss-outer-container">
      <div className="ss-container" onMouseEnter={pauseAutoSlide} onMouseLeave={startAutoSlide}>
        <div className="ss-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {sliderData.map((item, index) => (
            <div key={index} className="ss-slide">
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                <h1>
                  <img className={`pc_b ${index === currentIndex ? 'active' : ''}`} src={item.imgSrc} alt={item.imgAlt} />
                </h1>
              </a>
            </div>
          ))}
        </div>
       
      </div>
      <div className="ss-controls">
        <button className="ss-prev" onClick={showPrevSlide}></button>
        <div className="ss-indicators">
          {`${currentIndex + 1}/${sliderData.length}`}
        </div>
        <button className="ss-next" onClick={showNextSlide}></button>
      </div>
    </div>
  );
};

export default SimpleSlider;
