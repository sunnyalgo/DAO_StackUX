import { useWeb3React } from '@web3-react/core';
import { useState } from 'react';
import Modal from 'react-modal';
import styles from 'styles/Account.module.css';

import { connectors } from '../lib/connectors';
import { getEllipsisTxt } from '../lib/formatters';

Modal.setAppElement('#__next');
export const Account: React.FC = () => {
  const { activate, active, account } = useWeb3React();
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex">
      {active ? (
        <button className="border border-gray-dark rounded-lg px-2 py-1" onClick={openModal}>
          {getEllipsisTxt(account || '', 4)}
        </button>
      ) : (
        <button className="w-full p-2 bg-black text-white rounded-lg" onClick={openModal}>
          Connect Wallet
        </button>
      )}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className={styles.modal}>
        <div className="text-xl font-bold">Connect Wallet</div>
        <div className="grid grid-cols-2 gap-4 p-4">
          {connectors.map(({ title, icon, connector }, key) => (
            <div
              key={key}
              className="flex flex-col items-center cursor-pointer hover:bg-gray-light p-4 rounded-lg"
              onClick={async () => {
                try {
                  await activate(connector);
                  window.localStorage.setItem('connector', (key + 1).toString());
                  closeModal();
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <div>{icon && <img src={icon} className="w-8 h-8" alt={title} />}</div>
              <span>{title}</span>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
