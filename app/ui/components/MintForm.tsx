// MintForm.tsx
const MintForm = () => {
    return ( 
        <>
        <div className="flex flex-col gap-5 mt-12 border-[#2C2C2C] border w-2/4 h-screen border-b-0 bg-[#100F11] px-10 py-10">
          <div className="flex gap-5">
            <div className="flex w-full flex-col gap-4">
              <label htmlFor="name" className="text-[#ACACAC]">
                Name
              </label>
              <input
                type="text"
                placeholder="Kelvin"
                className="w-full px-[10px] py-[6px] h-[56px] bg-[#1818184D] bg-opacity-30 border-[#2C2C2C] border  text-base text-gray-400 outline-none focus:outline outline-offset-2 outline-1 focus:outline-[#ACACAC] focus:border"
              />
            </div>
            <div className="flex w-full flex-col gap-4">
              <label htmlFor="name" className="text-[#ACACAC]">
                Symbol
              </label>
              <input
                type="text"
                placeholder="KVN"
                className="w-full px-[10px] py-[6px] h-[56px] bg-[#1818184D] bg-opacity-30 border-[#2C2C2C] border  text-base text-gray-400 outline-none focus:outline outline-offset-2 outline-1 focus:outline-[#ACACAC] focus:border"
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <label htmlFor="name" className="text-[#ACACAC]">
              Total Supply
            </label>
            <input
              type="number"
              placeholder="eg 1000000 -  1 million"
              className="w-full px-[10px] py-[6px] h-[56px] bg-[#1818184D] bg-opacity-30 border-[#2C2C2C] border  text-base text-gray-400 outline-none focus:outline outline-offset-2 outline-1 focus:outline-[#ACACAC] focus:border"
            />
          </div>
          <button className="border-[#FF4D6A] bottom-1 py-3 bg-[#86303E] mt-5">
            {" "}
            Begin minting
          </button>
        </div>
        </>
     );
}
 
export default MintForm;