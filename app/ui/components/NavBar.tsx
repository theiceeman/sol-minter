"use client";
import Image from "next/image";
import Telegram from "@/public/telegram.svg";
import SolanaLogo from "@/public/solana-logo.svg";
import WalletIcon from "@/public/wallet-icon.svg";
import CaratDown from "@/public/carat-down.svg";
import DisconnectWallet from "@/public/disconnect-wallet.svg";
import ConnectWalletModal from "./ConnectWalletModal";
import { useState } from "react";
import truncateWalletAddress, {
  iSupportedNetwork,
} from "@/app/utils/web3-solana";
import { Listbox, Menu } from "@headlessui/react";
import { showToast } from "@/app/utils/toaster";

const networks = [
  { id: 1, name: "Devnet", value: iSupportedNetwork.devnet },
  { id: 2, name: "Mainnet", value: iSupportedNetwork.mainnetBeta },
];

const NavBar = ({
  setAddress,
  address,
  provider,
  setNetwork,
}: {
  setAddress: any;
  address: string;
  provider: any;
  setNetwork: any;
}) => {
  let [isOpen, setIsOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="flex  flex-col-reverse md:flex-row justify-between lg:px-10 w-full gap-5 ">
        <div className="flex flex-row w-full justify-center md:justify-start my-auto mx-auto md:mx-0 gap-3">
          <div className="flex">
            <Image
              src={SolanaLogo}
              width={35}
              height={35}
              className="block my-auto"
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div>
          <div className="flex flex-col my-auto">
            <h2 className="text-lg font-normal tracking-wider uppercase">
              Sol Minter
            </h2>
            <span className="text-xs text-[#ACACAC]">Beta</span>
          </div>
        </div>
        <div className="flex gap-3 w-full justify-center md:justify-end">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://t.me/+WpcxzU28svNkOWFk"
          >
            <div className="bg-[#FF4D6A1A] px-[10px] py-[10px] cursor-pointer hover:border-[#cf5c5c] hover:border">
              <Image
                src={Telegram}
                width={25}
                height={23}
                className="block"
                alt="telegram icon"
              />
            </div>
          </a>
          <ConnectWalletModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            closeModal={closeModal}
            setAddress={setAddress}
          />

          {address !== "" && (
            <div className="relative hidden md:block">
              <Listbox
                value={selectedNetwork}
                onChange={(value) => {
                  setSelectedNetwork(value);
                  setNetwork(value.value);
                  showToast(
                    `Please open wallet and switch network to Solana ${value.name}`,
                    "success"
                  );
                }}
              >
                <Listbox.Button>
                  <div className="bg-[#FF4D6A1A] px-[10px] py-[10px] flex flex-col cursor-pointer border border-transparent hover:border-[#cf5c5c] hover:border">
                    <div className="flex flex-row gap-3">
                      <span className="text-[#86303E]">
                        {selectedNetwork.name}
                      </span>
                      <Image
                        src={CaratDown}
                        width={12}
                        height={8}
                        className="block h-[8px] my-auto"
                        alt="carat icon"
                      />
                    </div>
                  </div>
                </Listbox.Button>
                <Listbox.Options>
                  {networks.map((network, index) => (
                    <Listbox.Option key={network.id} value={network}>
                      <div
                        style={{ top: `calc(100% * ${index + 1})` }}
                        className="bg-[#FF4D6A1A] px-[10px] py-[10px] flex absolute mt-1 w-full flex-col cursor-pointer border border-transparent hover:border-[#cf5c5c] hover:border"
                      >
                        <div className="flex flex-row gap-3">
                          <span className="text-[#86303E]">{network.name}</span>
                        </div>
                      </div>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
          )}
          {address !== "" && (
            <div className="relative">
              <Menu>
                <Menu.Button>
                  <div className="bg-[#FF4D6A1A] px-[10px] py-[10px] flex flex-col cursor-pointer border border-transparent hover:border-[#cf5c5c] hover:border">
                    <div className="flex flex-row gap-3">
                      <span className="text-[#86303E]">
                        {truncateWalletAddress(address, 6, 6)}
                      </span>
                      <Image
                        src={CaratDown}
                        width={12}
                        height={8}
                        className="block h-[8px] my-auto"
                        alt="carat icon"
                      />
                    </div>
                  </div>
                </Menu.Button>
                <Menu.Items>
                  <Menu.Item>
                    {({ active }) => (
                      <div className="absolute bg-[#FF4D6A1A] px-[10px] py-[10px] flex flex-col cursor-pointer border border-transparent hover:border-[#cf5c5c] hover:border mt-1">
                        <div
                          onClick={() =>
                            provider.request({ method: "disconnect" })
                          }
                          className="flex flex-row w-full gap-3"
                        >
                          <Image
                            src={DisconnectWallet}
                            className="block w-full my-auto"
                            alt="wallet icon"
                          />
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            </div>
          )}

          {address === "" && (
            <div
              onClick={openModal}
              className="bg-[#FF4D6A1A] px-[10px] py-[10px] flex flex-row gap-4 cursor-pointer border border-transparent hover:border-[#cf5c5c] hover:border"
            >
              <Image
                src={WalletIcon}
                width={25}
                height={23}
                className="hidden md:block"
                alt="Screenshots of the dashboard project showing desktop version"
              />
              <span className="text-[#86303E]">Connect wallet</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
