import Image from "next/image";
import PnsLogo from "@/public/pns-logo.svg";
import Telegram from "@/public/telegram.svg";
import Discord from "@/public/discord.svg";

const NavBar = () => {
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
            <div className="bg-[#FF4D6A1A] px-[10px] py-[10px] flex flex-row gap-4 cursor-pointer hover:border-[#cf5c5c] hover:border">
              <Image
                src={Discord}
                width={25}
                height={23}
                className="hidden md:block"
                alt="Screenshots of the dashboard project showing desktop version"
              />
              <span className="text-[#86303E]">Connect wallet</span>
            </div>
          </div>
        </div></>
     );
}
 
export default NavBar;