"use client";
import NavBar from "./ui/components/NavBar";
import MintForm from "./ui/components/MintForm";
import { useEffect, useState } from "react";
import {
  connectToBrowserWalletAgain,
  iSupportedNetwork,
  loadProvider,
} from "./utils/web3-solana";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";

export default function Home() {
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState<any>(null);
  const [network, setNetwork] = useState<any>(null);

  useEffect(() => {
    if (!provider) return;

    provider?.on("connect", (publicKey: string) => {
      setAddress(publicKey);
    });

    // Forget user's public key once they disconnect
    provider?.on("disconnect", () => {
      setAddress("");
    });
  }, [provider]);

  useEffect(() => {
    async function fetch() {
      try {
        setProvider(await loadProvider());

        let result = await connectToBrowserWalletAgain();
        if (result) setAddress(result);
      } catch (error) {
        console.log({ error });
      }
    }
    fetch();
    setNetwork(iSupportedNetwork.devnet);
  }, []);

  return (
    <div className="flex w-full">
      <Toaster position="top-right" />
      <Analytics />
      <div className="relative z-0 w-full">
        <div></div>
        <div className="flex relative h-screen w-full flex-col items-center md:px-8  pt-10 z-[1]">
          <NavBar
            setAddress={setAddress}
            address={address}
            provider={provider}
          />

          <div className="flex flex-col mx-2  mt-0 pt-12 text-center ">
            <p className="p-0 m-0 leading-[3rem] md:leading-[3.5rem] lg:leading-[6rem] tracking-tighter text-[40px] md:text-[60px] lg:text-[100px] font-bold text-white">
              Mint Fungible
              <br />
              Tokens on <span className="text-[#7cffa0]">Solana</span>
            </p>
            <p className="text-[#ACACAC] pt-5 text-sm lg:text-lg font-medium">
              Deploy spl tokens on the solana network, with your metadata stored
              onchain; <br /> all enabled by the Token-2022 program.
            </p>
          </div>
          <MintForm provider={provider} address={address} network={network} />
        </div>

        <div className="absolute top-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.12]  z-0"></div>
        <div className="absolute top-0 w-full h-full bg-[url('/bg1.svg')] opacity-[0.4] z-0"></div>
        <div className="absolute top-0 w-full h-screen bg-[url('/rectangle.svg')] z-0"></div>
      </div>
    </div>
  );
}
