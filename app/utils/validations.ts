import { showToast } from "./toaster";
import { iSupportedNetwork, iToken } from "./web3-solana";

export default async function validateDeployTokenInput(
    provider: any,
    network: iSupportedNetwork,
    publicKey: string,
    token: iToken
) {
    try {

        if (publicKey == "")
            throw new Error("Please connect your wallet.")

        if (token.name == "" || token.symbol == "" || token.logoUrl == "" || token.supply == "")
            throw new Error("Please fill all fields.")

    } catch (error: any) {
        // console.log({ error: error.message })
        showToast(error.message, 'failed')
        throw new Error(error)
    }

}