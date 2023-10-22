import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Button from "../../components/common/Button";
import { LandingTagLines } from "../../constants/landingTagLines";

function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const navigate = useNavigate();

  let settings = {
    dots: currentSlide < LandingTagLines.length - 1,
    infinite: false,
    autoplay: true,
    arrows: false,
    speed: 400,
    className: "center my_50_mx_0",
    adaptiveHeight: true,
    pauseOnHover: false,
    autoplaySpeed: 3000,
    centerPadding: "60px",
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current: number) => setCurrentSlide(current),
  };

  return (
    <div className="text-center">
      <Slider {...settings}>
        {LandingTagLines.map((details) => (
          <div key={details.title} className="mb-10 w-full h-full">
            <h2 className="title mb-5 font-bold text-[24px]">
              {details.title}
            </h2>
            <p className="p-8 ">{details.description}</p>
            {currentSlide === 1 && (
              <Button
                className="min-w-[300px] mt-[70px] text-white bg-gray-900 border hover:bg-gray-950 rounded-lg flex justify-center m-auto
        transition duration-500 hover:scale-110 p-3"
                onClick={() => {
                  navigate("/register", { replace: true });
                }}
              >
                Proceed
              </Button>
            )}
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default LandingPage;
