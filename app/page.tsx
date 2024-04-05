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
  const [mintedTokenAddress, setMintedTokenAddress] = useState<any>(null);

  const tokenExplorerUrl = (network: iSupportedNetwork) => {
    let url;
    switch (network) {
      case iSupportedNetwork.mainnetBeta:
        url = `https://solscan.io/token/${mintedTokenAddress}`;
        break;
      case iSupportedNetwork.devnet:
        url = `https://solscan.io/account/${mintedTokenAddress}?address=${mintedTokenAddress}&cluster=devnet`;
        break;
      default:
        url = "";
        break;
    }
    // console.log({url})

    return url;
  };

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
            setNetwork={setNetwork}
          />

          {mintedTokenAddress !== null && (
            <div className="bg-[#FF4D6A1A] px-[10px] py-[10px] flex flex-col w-full mt-5 border border-transparent hover:border-[#cf5c5c] hover:border">
              <div className="flex flex-row gap-3 justify-center w-full">
                <span className="text-[#86303E] w-full text-center">
                  Minting successfull.&nbsp;
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                    href={tokenExplorerUrl(network)}
                  >
                    Preview here
                  </a>
                </span>
              </div>
            </div>
          )}

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
          <MintForm
            provider={provider}
            address={address}
            network={network}
            setMintedTokenAddress={setMintedTokenAddress}
          />
        </div>

        <div className="absolute top-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.12]  z-0"></div>
        <div className="absolute top-0 w-full h-full bg-[url('/bg1.svg')] opacity-[0.4] z-0"></div>
        <div className="absolute top-0 w-full h-screen bg-[url('/rectangle.svg')] z-0"></div>
      </div>
    </div>
  );
}
