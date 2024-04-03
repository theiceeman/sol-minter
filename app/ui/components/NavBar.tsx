"use client";
import Image from "next/image";
import Telegram from "@/public/telegram.svg";
import SolanaLogo from "@/public/solana-logo.svg";
import WalletIcon from "@/public/wallet-icon.svg";
import CaratDown from "@/public/carat-down.svg";
import DisconnectWallet from "@/public/disconnect-wallet.svg";
import ConnectWalletModal from "./ConnectWalletModal";
import { useState } from "react";
import truncateWalletAddress from "@/app/utils/web3-solana";
import { Menu } from "@headlessui/react";

const NavBar = ({
  setAddress,
  address,
  provider,
}: {
  setAddress: any;
  address: string;
  provider: any;
}) => {
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="flex flex-row justify-between px-10 w-full ">
        <div className="flex flex-row my-auto gap-3">
          <Image
            src={SolanaLogo}
            width={25}
            height={25}
            className="block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
          <h2 className="text-lg font-normal tracking-wider uppercase">
            Sol Minter
          </h2>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#FF4D6A1A] px-[10px] py-[10px]">
            <Image
              src={Telegram}
              width={25}
              height={23}
              className="hidden md:block"
              alt="Screenshots of the dashboard project showing desktop version"
            />
          </div>
          {/*<div className="bg-[#FF4D6A1A] px-[10px] py-[10px]">
              <Image
                src={Discord}
                width={25}
                height={23}
                className="hidden md:block"
                alt="Screenshots of the dashboard project showing desktop version"
              />
            </div> */}
          <ConnectWalletModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            closeModal={closeModal}
            setAddress={setAddress}
          />

          {address !== "" && (
            <div className="relative">
              <Menu>
                <Menu.Button>
                  <div className="bg-[#FF4D6A1A] px-[10px] py-[10px] flex flex-col cursor-pointer border border-transparent hover:border-[#cf5c5c] hover:border">
                    <div className="flex flex-row gap-3">
                      <span className="text-[#86303E]">
                        {truncateWalletAddress(address, 11, 11)}
                      </span>
                      <Image
                        src={CaratDown}
                        width={12}
                        height={8}
                        className="block h-[8px] my-auto"
                        alt="Screenshots of the dashboard project showing desktop version"
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
                            width={12}
                            height={8}
                            className="block w-full my-auto"
                            alt="Screenshots of the dashboard project showing desktop version"
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
