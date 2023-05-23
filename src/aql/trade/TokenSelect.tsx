/* eslint-disable @typescript-eslint/no-explicit-any */
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

type TokenSelect = {
  title: string;
  token: any;
  tokens: any;
  select: (token: any) => void;
};
export const TokenSelect: React.FC<TokenSelect> = ({ title, token, tokens, select }) => {
  const menuRef: any = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShow(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const handleSelect = (token: any) => {
    select(token);
    setShow(false);
  };

  return (
    <div ref={menuRef} className="flex flex-col w-full relative">
      <span className="text-sm">{title}</span>
      <div
        className="flex items-center justify-between bg-gray-light shadow rounded-lg py-2 px-4"
        onClick={() => setShow(!show)}
      >
        <div className="mb-2 cursor-pointer flex-1">
          <span className="text-sm text-gray-dark">Token</span>
          {token && (
            <div className="flex items-center space-x-1">
              <img src={token.logoURI} className="w-6 h-6 rounded-full" alt={token.symbol} />
              <span>{token.symbol}</span>
            </div>
          )}
        </div>
        <FontAwesomeIcon icon={faChevronDown} className="w-5 h-5 text-gray-dark cursor-pointer" />
      </div>

      {show && tokens && (
        <div className="absolute rounded bg-gray-main py-1 top-24 w-full z-10">
          {Object.keys(tokens).map((token, idx) => (
            <div
              className="flex py-1 px-4 items-center cursor-pointer rounded hover:bg-gray-light"
              key={idx}
              onClick={() => handleSelect(tokens[token])}
            >
              <img
                src={tokens[token].logoURI}
                className="w-6 h-6 rounded-full"
                alt={tokens[token].symbol}
              />
              <span className="mx-2">{tokens[token].symbol}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
