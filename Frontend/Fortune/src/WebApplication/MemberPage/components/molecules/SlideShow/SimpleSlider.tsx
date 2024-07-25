import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SimpleSlider.scss";

const sliderData = [
  {
    href: "",
    imgSrc: "https://www.truefacet.com/guide/wp-content/uploads/2018/03/JEWELRY-AUCTIONS_HERO-IMAGE.jpg",
    imgAlt: "Heaven Burns Red 第五章後編 開幕 2024.02.23",
  },
  {
    href: "",
    imgSrc: "https://www.livemint.com/lm-img/img/2023/05/14/1600x900/SWITZERLAND-LUXURY-JEWELLERY-AUCTION-HISTORY-7_1684034106982_1684034121485.jpg",
    imgAlt: "Heaven Burns Red 第四章後編 開幕 2023.04.28",
  },
  {
    href: "",
    imgSrc: "https://m.economictimes.com/thumb/msid-94272470,width-1200,height-900,resizemode-4,imgsize-82374/jewelry-auction.jpg",
    imgAlt: "Heaven Burns Red 第四章前編 開幕 2022.07.29",
  },
  {
    href: "",
    imgSrc: "https://media.cnn.com/api/v1/images/stellar/prod/181015135326-marie-antoinette-1.jpg?q=w_2000,c_fill",
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
