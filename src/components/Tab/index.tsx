interface TabProps {
  label: string;
  children: React.ReactNode;
}

const Tab: React.FC<TabProps> = ({ label, children }) => (
  <div className="text-white">
    <h3>{label}</h3>
    {children}
  </div>
);

export default Tab;
