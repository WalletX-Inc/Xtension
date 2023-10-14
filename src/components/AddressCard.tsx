import { getShortDisplayString } from "../utils/helper";
import { toSvg } from "jdenticon";
const svgString = toSvg("helll", 100);
const svg = new Blob([svgString], { type: "image/svg+xml" });
const url = URL.createObjectURL(svg);

type addressesProps = {
  pfp: string;
  name: string;
  addresses: string;
  isSelected: boolean;
  getClickedAddress: Function;
  onClick: () => void;
};

const AddressCard = ({
  pfp,
  name,
  addresses,
  getClickedAddress,
  isSelected,
  onClick,
}: addressesProps) => {
  const sendAddress = () => {
    const clickedAddress = addresses;
    getClickedAddress(clickedAddress);
  };

  return (
    <>
      <div
        onClick={() => {
          sendAddress();
          onClick();
        }}
        className="max-w-[92%] mx-auto m-3 "
      >
        <div
          className={`flex flex-row gap-3 items-center bg-white rounded-xl shadow-md px-4 py-2 border border-gray-300${
            isSelected
              ? "border-2 border-solid border-black border-opacity-80"
              : ""
          }`}
        >
          <img
            src={url}
            alt="Address Logo"
            className="min-w-[20%] w-15 h-15 rounded-2xl object-cover mr-4 border-2"
          />

          <div className="min-w-[80%]">
            {/* <p className="text-xl font-semibold">{name} </p> */}
            <p className="text-lg font-semibold overflow-hidden text-gray-600">
              {getShortDisplayString(addresses)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressCard;
