import { generateAddressIcon, getShortDisplayString } from "../utils/helper";

type addressesProps = {
  name: string;
  addresses: string;
  isSelected: boolean;
  getClickedAddress: (addresses: any) => any;
  onClick: () => void;
};

const AddressCard = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          className={`flex flex-row gap-3 items-center bg-gray-800 text-white rounded-xl shadow-md px-4 py-2 border border-gray-700 ${
            isSelected ? "border-2 border-solid border-white " : ""
          }`}
        >
          <img
            src={generateAddressIcon(addresses)}
            alt="Address Logo"
            className="min-w-[20%] w-15 h-15 rounded-xl object-cover mr-4 border"
          />

          <div className="min-w-[80%]">
            {/* <p className="text-xl font-semibold">{name} </p> */}
            <p className="text-lg font-semibold overflow-hidden ">
              {getShortDisplayString(addresses)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddressCard;
