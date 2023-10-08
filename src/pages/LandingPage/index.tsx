import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import Button from "../../components/common/Button";
import { LandingTagLines } from "../../utils/constants";

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

  console.log(LandingTagLines, currentSlide);

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
                className="rounded p-2 bg-white hover:bg-white-500 text-blue-700 font-semibold
              border border-blue-500 hover:border-transparent"
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
