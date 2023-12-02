import StepHeader from './StepHeader'
import { generateAddressIcon, getShortDisplayString } from '../../utils/helper';

function DappConnect() {

    const smartAddress=localStorage.getItem('smartAccount')
    
  return (
    <div className="container mt-3">
      <StepHeader completedSteps={[1]} />
      <a
        href="https://www.walletx.info/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center mb-6"
      >
        <span className=" mt-2 rounded-t-3xl bg-gray-700 underline mb-4  py-3 px-6 font-medium">
          www.walletx.info
        </span>{" "}
      </a>
      <h2 className="text-2xl font-bold text-center mb-8">
        Connect with WalletX
      </h2>
      <div className="max-w-[86%] mx-auto m-3 mb-">
        <div
          className={`flex flex-row gap-3 items-center bg-gray-800 text-white rounded-xl shadow-md px-4 py-2 border border-gray-700  border-solid
          `}
        >
          <div className="flex items-center">
            <input
              checked
              id="checked-checkbox"
              type="checkbox"
              value=""
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="checked-checkbox"
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
            ></label>
          </div>
          <img
            src={generateAddressIcon("bhumik")}
            alt="Address Logo"
            className="w-12 rounded-xl object-cover mr-3 border"
          />

          <div className="min-w-[80%] text-lg">
            <p className=" font-semibold">
              Account 1
              <span className="font-semibold overflow-hidden ">
                {getShortDisplayString(smartAddress)}
              </span>{" "}
            </p>
            <p>0 MATIC</p>
          </div>
        </div>
      </div>
      <h2 className="text-lg text-center mb-2 mt-[110px] ">
        Only connect with the sites you trust.
        <span className="text-blue-500 ml-1 cursor-pointer">Learn more</span>
      </h2>
      <hr className="my-3 mx-7 text-gray-700" />
      <div className="flex justify-center mt-8">
        <button className="w-36 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md ml-4">
          Cancel
        </button>
        <button
          className="w-36 text-white bg-gray-700 hover:bg-gray-600 rounded-lg flex justify-center m-auto
          transition duration-500 hover:scale-110 p-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default DappConnect