import {
  deployTokenTransaction,
  iSupportedNetwork,
} from "@/app/utils/web3-solana";
import { useFormik } from "formik";

// MintForm.tsx
const MintForm = ({
  provider,
  address,
  network,
}: {
  provider: any;
  address: string;
  network: iSupportedNetwork;
}) => {
  const formik = useFormik({
    initialValues: {
      name: "",
      symbol: "",
      supply: "",
      logoUrl: "",
    },
    onSubmit: (values) => {
    //   console.log({ network, provider, address, values });
      //   return;
      deployTokenTransaction(provider, network, address, values);
      // formik.resetForm()
    },
  });

  return (
    <>
      <div className="flex flex-col gap-5 mt-12 border-[#2C2C2C] border w-2/4 h-screen border-b-0 bg-[#100F11] px-10 py-10">
        <div className="flex gap-5">
          <div className="flex w-full flex-col gap-4">
            <label htmlFor="name" className="text-[#ACACAC]">
              Name
            </label>
            <input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
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
              name="symbol"
              value={formik.values.symbol}
              onChange={formik.handleChange}
              type="text"
              placeholder="KVN"
              className="w-full px-[10px] py-[6px] h-[56px] bg-[#1818184D] bg-opacity-30 border-[#2C2C2C] border  text-base text-gray-400 outline-none focus:outline outline-offset-2 outline-1 focus:outline-[#ACACAC] focus:border"
            />
          </div>
        </div>
        <div className="flex gap-5">
          <div className="flex w-full flex-col gap-4">
            <label htmlFor="name" className="text-[#ACACAC]">
              Total Supply
            </label>
            <input
              name="supply"
              value={formik.values.supply}
              onChange={formik.handleChange}
              type="number"
              placeholder="eg 1000000 -  1 million"
              className="w-full px-[10px] py-[6px] h-[56px] bg-[#1818184D] bg-opacity-30 border-[#2C2C2C] border  text-base text-gray-400 outline-none focus:outline outline-offset-2 outline-1 focus:outline-[#ACACAC] focus:border"
            />
          </div>
          <div className="flex w-full flex-col gap-4">
            <label htmlFor="name" className="text-[#ACACAC]">
              Logo URL
            </label>
            <input
              name="logoUrl"
              value={formik.values.logoUrl}
              onChange={formik.handleChange}
              type="text"
              placeholder="eg https://mytoken.com/logo.png"
              className="w-full px-[10px] py-[6px] h-[56px] bg-[#1818184D] bg-opacity-30 border-[#2C2C2C] border  text-base text-gray-400 outline-none focus:outline outline-offset-2 outline-1 focus:outline-[#ACACAC] focus:border"
            />
          </div>
        </div>
        <button
          onClick={() => formik.handleSubmit()}
          type="button"
          className="border-[#FF4D6A] bottom-1 py-3 bg-[#86303E] mt-5 hover:border-[#ACACAC] hover:border"
        >
          {" "}
          Proceed with Minting...
        </button>
      </div>
    </>
  );
};

export default MintForm;
