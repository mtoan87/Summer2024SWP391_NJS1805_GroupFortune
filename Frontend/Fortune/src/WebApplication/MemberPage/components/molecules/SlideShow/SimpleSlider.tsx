import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SimpleSlider.scss";

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
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="carousel-container">
      <Slider {...settings} aria-label="Image Carousel">
        {sliderData.map((item, index) => (
          <div className="carousel-item" key={index}>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              <img src={item.imgSrc} alt={item.imgAlt} />
            </a>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SimpleSlider;
