import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from "@solana/web3.js";
import { buildCreateTokenTransaction, generateKeyPair } from "./deploy-token-transaction";
import { PhantomProvider } from "./types";

const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");
const connection = new Connection(CLUSTER_URL, { commitment: "finalized" });

declare global {
    interface Window {
        ethereum?: any;
        web3: any;
        solana: any;
        phantom: any;
    }
}

export  function loadProvider() {
    const { solana } = window;
    console.log({ window })

    // if (!solana) {
    //     console.log('Install Solana Phantom wallet.');
    //     return;
    // }

    if ('phantom' in window) {
        const provider = window.phantom?.solana;

        if (provider?.isPhantom) {
            // console.log({provider})
            return provider;
        }
    }

    // window.open('https://phantom.app/', '_blank');
};

export async function connectToBrowserWalletAfresh() {
    const { solana } = window;

    try {
        if (!solana) throw new Error('Install Solana Phantom wallet.')
        // const provider = window.phantom?.solana;

        const wallet = await solana.request({ method: "connect", params: {} });
        return wallet.publicKey.toString();

    } catch (err: any) {
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
        // if (err.message === 'User rejected the request.') {
        //     const wallet = await solana.request({ method: "connect", params: {} });
        //     return wallet.publicKey.toString();
        // }

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
const createTransferTransaction = async (publicKey: PublicKey | string) => {
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


export async function transferTransaction(provider: any, publicKey: PublicKey | string) {
    try {
        const transaction = await createTransferTransaction(publicKey);
        // console.log({transaction});return;
        const signature = await provider.signAndSendTransaction(transaction);
        // console.log({ signature })
    } catch (error) {
        console.log({ message: error });
    }
}




export async function deployTokenTransaction(provider: any, publicKey: string) {
    let mintKeypair = generateKeyPair()

    const tokenConfig = {
        mint: mintKeypair.publicKey,
        updateAuthority: new PublicKey(publicKey),
        name: "AVALANCHE",
        symbol: "AVAX",
        image: "https://www.paradigm.xyz/static/madrealities.png",
        uri: "https://raw.githubusercontent.com/theiceeman/solana-crash-course/main/token.json",
        additionalMetadata: [
            ["description", "This is a short description..."]
        ] as [string, string][],
    };

    try {
        const transaction = await buildCreateTokenTransaction(
            tokenConfig,
            new PublicKey(publicKey),
            mintKeypair,
            1000000_000000000
        );

        const serializedTx = transaction.serialize({ requireAllSignatures: false });
        const recoveredTransaction = Transaction.from(Buffer.from(serializedTx));

        recoveredTransaction.partialSign(mintKeypair);
        const signedTx = await provider.signTransaction(recoveredTransaction);

        const confirmTransaction = await connection.sendRawTransaction(
            signedTx.serialize()
        );

        console.log({ confirmTransaction }); return;
    } catch (error) {
        console.log({ message: error });
    }
}
