import Tab from "./";
import TabContainer from "./Tabs";
import logoIcon from "../../assets/icons/icon16.png";

const TabHandler = () => {
  return (
    <div>
      <TabContainer>
        <Tab label="Tokens">
          <div className="pb-4">
            <h2 className="text-lg font-medium mb-2">All Tokens</h2>
            <ul className="divide-y border divide-gray-200 dark:divide-gray-700 max-h-[190px] overflow-x-hidden overflow-y-auto">
              {[1, 2, 3].map((token) => (
                <li className="py-3 px-3 sm:py-4" key={token}>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={logoIcon}
                        alt="Wallet x"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate dark:text-white">
                        Neil Sims
                      </p>
                      <p className="text-sm truncate dark:text-gray-400">
                        email@windster.com
                      </p>
                    </div>
                    <div className="inline-flex items-center text-base font-semibold dark:text-white">
                      $320
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <p className="">Wallet X Tab 1 data</p>
          </div>
        </Tab>
        <Tab label="NFTs">
          <div className="py-4">
            <div className="relative mt-12">
              <h2 className="text-white text-3xl md:text-4xl font-bold flex flex-row justify-center items-center">
                Coming
                <div className="relative text-sm mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-up-fill text-blue-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  <div className="absolute -top-12 transform -rotate-45 text-blue-500">
                    <p className="font-light text-base text-white bg-blue-500 rounded-md px-2 py-0">
                      super
                    </p>
                  </div>
                </div>
                Soon
              </h2>
            </div>
          </div>
        </Tab>
        <Tab label="Transactions">
          <div className="py-4">
            <div className="relative mt-12">
              <h2 className="text-white text-3xl md:text-4xl font-bold flex flex-row justify-center items-center">
                Coming
                <div className="relative text-sm mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-caret-up-fill text-blue-500"
                    viewBox="0 0 16 16"
                  >
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
                  </svg>
                  <div className="absolute -top-12 transform -rotate-45 text-blue-500">
                    <p className="font-light text-base text-white bg-blue-500 rounded-md px-2 py-0">
                      super
                    </p>
                  </div>
                </div>
                Soon
              </h2>
            </div>
          </div>
        </Tab>
      </TabContainer>
    </div>
  );
};

export default TabHandler;
