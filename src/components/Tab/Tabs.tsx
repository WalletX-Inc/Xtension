import React, { useState, ReactElement, ReactNode } from "react";

interface TabProps {
  label: string;
  children: ReactNode;
}

interface TabContainerProps {
  children: ReactElement<TabProps>[];
}

const TabContainer: React.FC<TabContainerProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div className="text-white  border-gray-200 rounded shadow-md">
      <div className="flex space-x-4 ">
        {children.map((child, index) => {
          const isActive = index === activeTab;
          return (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              className={`${
                activeTab === index
                  ? "border-b-2 text-blue-600  border-blue-800 "
                  : ""
              } flex-1 font-medium my-2 py-2`}
            >
              {child.props.label}
            </button>
          );
        })}
      </div>
      <div>{children[activeTab].props.children}</div>
    </div>
  );
};

export default TabContainer;
