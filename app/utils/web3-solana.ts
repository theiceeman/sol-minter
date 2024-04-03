import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { buildCreateTokenTransaction, generateKeyPair } from "./deploy-token-transaction";
import validateDeployTokenInput from "./validations";
import { showToast } from "./toaster";


declare global {
    interface Window {
        ethereum?: any;
        web3: any;
        solana: any;
        phantom: any;
    }
}
export interface iToken {
    name: string,
    symbol: string,
    logoUrl: string,
    supply: string
}
export enum iSupportedNetwork {
    mainnetBeta = 'mainnet-beta',
    devnet = 'devnet'
}


export function loadConnection(network: iSupportedNetwork) {
    let CLUSTER_URL;
    if (network === iSupportedNetwork.mainnetBeta) {
        CLUSTER_URL = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_RPC
    } else {
        CLUSTER_URL = clusterApiUrl(network)
    }
    console.log({ CLUSTER_URL })
    if (!CLUSTER_URL) return;

    return new Connection(CLUSTER_URL, { commitment: "finalized" });
}

export function loadProvider() {
    try {
        const { solana } = window;
        console.log({ window })

        if (!solana) {
            throw new Error('Install Solana Phantom wallet.');
            return;
        }

        if ('phantom' in window) {
            const provider = window.phantom?.solana;

            if (provider?.isPhantom) {
                // console.log({provider})
                return provider;
            }
        }
    } catch (err: any) {
        showToast(err.message, 'failed')
        console.log({ err: err.message })
    }

    // window.open('https://phantom.app/', '_blank');
};

export async function connectToBrowserWalletAfresh() {
    const { solana } = window;

    try {
        if (!solana) throw new Error('Please install Phantom browser wallet.')
        // const provider = window.phantom?.solana;

        const wallet = await solana.request({ method: "connect", params: {} });
        return wallet.publicKey.toString();

    } catch (err: any) {
        showToast(err.message, 'failed')
        console.log({ err: err.message })
    }
}

export async function connectToBrowserWalletAgain() {
    const { solana } = window;

    try {
        if (!solana) throw new Error('Install Solana Phantom wallet.')
        // const provider = window.phantom?.solana;

        const wallet = await solana.request({ method: "connect", params: { onlyIfTrusted: true } });
        return wallet.publicKey.toString();

    } catch (err: any) {
        showToast(err.message, 'failed')
        console.log({ err: err.message })
    }
}

export default function truncateWalletAddress(address: string, startLength = 2, endLength = 2) {
    if (!address || typeof address !== 'string') {
        return '';
    }

    const maxLength = startLength + endLength + 3; // 2 for '0x' prefix, 1 for ellipsis (...)

    if (address.length <= maxLength) {
        return address;
    }

    const startPart = address.slice(0, startLength);
    const endPart = address.slice(-endLength);
    return `${startPart}...${endPart}`;
}



/**
 * Creates an arbitrary transfer transaction
 * @param   {PublicKey}      publicKey  a public key
 * @param   {Connection}  connection an RPC connection
 * @returns {Promise<Transaction>}            a transaction
 */
const createTransferTransaction = async (publicKey: PublicKey | string, network: iSupportedNetwork) => {
    let connection = loadConnection(network);
    if (!connection)
        throw new Error('Please connect wallet.')

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: new PublicKey(publicKey),
            toPubkey: new PublicKey(publicKey),
            lamports: 100,
        })
    );
    // console.log({transaction});return;
    transaction.feePayer = new PublicKey(publicKey);
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    return transaction;
};


export async function transferTransaction(provider: any, publicKey: PublicKey | string, network: iSupportedNetwork) {
    try {
        const transaction = await createTransferTransaction(publicKey, network);
        // console.log({transaction});return;
        const signature = await provider.signAndSendTransaction(transaction);
        // console.log({ signature })
    } catch (error) {
        console.log({ message: error });
    }
}




export async function deployTokenTransaction(
    provider: any,
    network: iSupportedNetwork,
    publicKey: string,
    token: iToken
) {
    try {

        await validateDeployTokenInput(provider, network, publicKey, token)

        let mintKeypair = generateKeyPair()
        let connection = loadConnection(network);
        if (!connection)
            throw new Error('Please connect wallet.')

        const tokenConfig = {
            mint: mintKeypair.publicKey,
            updateAuthority: new PublicKey(publicKey),
            name: token.name,
            symbol: token.symbol,
            image: token.logoUrl,
            uri: "https://raw.githubusercontent.com/theiceeman/solana-crash-course/main/token.json",
            additionalMetadata: [
                ["description", "This is a short description..."]
            ] as [string, string][],
        };

        const transaction = await buildCreateTokenTransaction(
            network,
            tokenConfig,
            new PublicKey(publicKey),
            mintKeypair,
            Number(token.supply) * 10 ** 9
        );

        const serializedTx = transaction.serialize({ requireAllSignatures: false });
        const recoveredTransaction = Transaction.from(Buffer.from(serializedTx));

        recoveredTransaction.partialSign(mintKeypair);
        const signedTx = await provider.signTransaction(recoveredTransaction);

        const confirmTransaction = await connection.sendRawTransaction(
            signedTx.serialize()
        );

        console.log({ confirmTransaction }); return;
    } catch (error: any) {
        showToast(error.message, 'failed')
        throw new Error(error)
    }
}
