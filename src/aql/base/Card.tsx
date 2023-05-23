export const Card: React.FC = ({ children }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow border border-gray-main">{children}</div>
  );
};
