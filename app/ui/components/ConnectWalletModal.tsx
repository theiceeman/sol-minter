"use client";
import { Dispatch, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import PhantomIcon from "@/public/phantom-purple-icon.png";
import Image from "next/image";
import { connectToBrowserWalletAfresh } from "@/app/utils/web3-solana";

export default function ConnectWalletModal({
  isOpen,
  setIsOpen,
  closeModal,
  setAddress,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  closeModal: any;
  setAddress: any;
}) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto bg-opacity-50 backdrop-blur-md">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full md:w-1/3 transform overflow-hidden  bg-[#100F11] px-8 py-10 text-left align-middle shadow-xl transition-all border-[#2C2C2C] border">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-medium leading-6 text-white"
                >
                  Connect your wallet
                </Dialog.Title>
                <div className="flex my-10">
                  <div
                    onClick={async () => {
                      let result = await connectToBrowserWalletAfresh();
                      if (result) setAddress(result);
                      closeModal();
                    }}
                    className="bg-[#FF4D6A1A]  px-[40px] py-[34px] cursor-pointer hover:border-[#cf5c5c] hover:border"
                  >
                    <Image
                      src={PhantomIcon}
                      width={80}
                      height={80}
                      className="block"
                      alt="Screenshots of the dashboard project showing desktop version"
                    />
                    <p className="mt-3">Phantom</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Currently, we only support Phantom browser wallet. <br />{" "}
                    Ensure you have Phantom installed before proceeding, please.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
