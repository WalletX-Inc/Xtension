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
                      <p className="text-sm      truncate dark:text-gray-400">
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
          </div>
        </Tab>
        <Tab label="NFTs">
          <div className="py-4">
            <h2 className="text-lg font-medium mb-2">Tab 2 Content</h2>
            <p className="">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
              mollitia, molestiae quas vel sint commodi repudiandae consequuntur
            </p>
          </div>
        </Tab>
        <Tab label="Transactions">
          <div className="py-4">
            <h2 className="text-lg font-medium mb-2">Tab 3 Content</h2>
            <p className="">
              uo neque error repudiandae fuga? Ipsa laudantium molestias eos
              sapiente officiis modi at sunt excepturi expedita sint? Sed
              quibusdam recusandae alias error harum maxime adipisci amet
              laborum.
            </p>
          </div>
        </Tab>
      </TabContainer>
    </div>
  );
};

export default TabHandler;
