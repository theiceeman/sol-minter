import Image from "next/image";
import NavBar from "./ui/components/NavBar";
import MintForm from "./ui/components/MintForm";

export default function Home() {
  return (
    <div className="relative z-0">
      <div className="flex relative h-screen flex-col items-center px-24  pt-10 z-[1]">
        <NavBar />

        <div className="flex flex-col   mt-0 pt-12 text-center ">
          <p className="p-0 m-0 leading-[6rem] tracking-tighter text-[100px] font-bold text-white">
            Mint SPL Token
            <br /> on <span className="text-[#7cffa0]">Solana</span>.
          </p>
          <p className="text-[#ACACAC] pt-5 text-lg font-medium">
            Deploy spl tokens on the solana network, with your metadata stored
            onchain; <br /> all enabled by the Token-2022 program.
          </p>
        </div>
        <MintForm />
      </div>

      <div className="absolute top-0 w-full h-full bg-[url('/noise.svg')] opacity-[0.12]  z-0"></div>
      <div className="absolute top-0 w-full h-full bg-[url('/bg1.svg')] opacity-[0.4] z-0"></div>
      <div className="absolute top-0 w-full h-screen bg-[url('/rectangle.svg')] z-0"></div>
    </div>
  );
}
