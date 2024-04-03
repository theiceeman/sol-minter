"use client";
import Image from "next/image";
import PnsLogo from "@/public/pns-logo.svg";
import WalletIcon from "@/public/wallet-icon.svg";
import Discord from "@/public/discord.svg";
import ConnectWalletModal from "./ConnectWalletModal";
import { useState } from "react";

const NavBar = () => {
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
        <div className="flex">
          <Image
            src={PnsLogo}
            width={83}
            height={37}
            className="hidden md:block"
            alt="Screenshots of the dashboard project showing desktop version"
          />
        </div>
        <div className="flex gap-3">
          {/* <div className="bg-[#FF4D6A1A] px-[10px] py-[10px]">
              <Image
                src={Telegram}
                width={25}
                height={23}
                className="hidden md:block"
                alt="Screenshots of the dashboard project showing desktop version"
              />
            </div>
            <div className="bg-[#FF4D6A1A] px-[10px] py-[10px]">
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
          />

          {/* <div className="fixed inset-0 flex items-center justify-center">
            <button
              type="button"
              onClick={openModal}
              className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white hover:bg-black/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
            >
              Open dialog
            </button>
          </div> */}

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
        </div>
      </div>
    </>
  );
};

export default NavBar;
