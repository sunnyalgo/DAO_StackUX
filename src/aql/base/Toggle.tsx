import { useEffect, useState } from 'react';

type ToggleProps = {
  state: boolean;
  onChange: (val: boolean) => void;
  alert?: string;
};
export const Toggle = ({ state, onChange }: ToggleProps) => {
  const [toggle, setToggle] = useState<boolean>();
  const toggleClass = ' transform translate-x-4 bg-blue-main';
  const toggleDisableClass = ' bg-gray-dark';

  useEffect(() => {
    setToggle(state);
  }, [state]);

  const handleChange = async () => {
    try {
      await onChange(!toggle);
      setToggle(!toggle);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="w-10 h-5 flex items-center bg-gray-main rounded-full p-1 cursor-pointer"
      onClick={handleChange}
    >
      <div
        className={
          'h-4 w-4 rounded-full shadow-md transform duration-200 ease-in-out' +
          (toggle ? toggleClass : toggleDisableClass)
        }
      />
    </div>
  );
};
