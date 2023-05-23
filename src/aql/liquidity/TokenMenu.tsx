/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from 'react';

type TokenMenuProps = {
  tokens: any;
  token: any;
  select: (token: any) => void;
};
const TokenMenu: React.FC<TokenMenuProps> = ({ tokens, token, select }) => {
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
    <div className="relative w-64" ref={menuRef}>
      {token && (
        <div className="flex items-center cursor-pointer px-2" onClick={() => setShow(!show)}>
          <img src={token.logoURI} className="w-6 h-6 rounded-full" alt={token.symbol} />
          <span className="mx-2">{token.symbol}</span>
        </div>
      )}

      {show && tokens && (
        <div className="absolute rounded bg-gray-light py-1 top-8">
          {Object.keys(tokens).map((token, idx) => (
            <div
              className="flex py-1 px-2 items-center cursor-pointer hover:bg-gray-main"
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

export default TokenMenu;
