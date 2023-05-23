const data = [
  {
    title: '24h change:',
    value: 0.7,
  },
  {
    title: '7d change:',
    value: -11.4,
  },
  {
    title: '30d change:',
    value: -12.9,
  },
  {
    title: 'Since launch:',
    value: 1.8,
  },
  {
    title: 'Since all time high:',
    value: -13.5,
  },
];

const Distributions = [
  {
    title: 'Total tokens distributed:',
    value: '34,000,000',
  },
  {
    title: 'Total tokens burned:',
    value: '1,000,000',
  },
  {
    title: 'Total tokens circulating:',
    value: '33,000,000',
  },
  {
    title: 'Maximum distribution:',
    value: '1,000,000,000',
  },
  {
    title: '% of total burned:',
    value: '0.08%',
  },
];

export const AQLStatus: React.FC = () => {
  return (
    <div className="flex space-x-4">
      <div className="w-80 shadow p-4 rounded-xl ">
        <div className="border border-gray-main bg-gray-light p-2 rounded-xl flex justify-between">
          <span>AQL Price:</span>
          <span className="font-bold">$0.76</span>
        </div>
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between pr-4 space-y-2">
            <span>{item.title}</span>
            {item.value > 0 && (
              <span className="text-green-main font-semibold text-lg">{item.value}</span>
            )}
            {item.value < 0 && (
              <span className="text-red-main font-semibold text-lg">{item.value}</span>
            )}
          </div>
        ))}
      </div>
      <div className="flex-1 shadow rounded-xl p-4">
        <div className="border border-gray-main bg-gray-light p-2 rounded-xl w-64 flex justify-between">
          <span>AQL Price:</span>
          <span className="font-bold">$0.76</span>
        </div>
        {Distributions.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between pr-4 space-y-2">
            <span>{item.title}</span>
            <span className="text-blue-main font-semibold text-lg">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
