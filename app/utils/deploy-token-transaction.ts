import { createInitializeMintInstruction, createMintToCheckedInstruction, createInitializeInstruction, TOKEN_2022_PROGRAM_ID, createInitializeMetadataPointerInstruction, ExtensionType, getMintLen, TYPE_SIZE, LENGTH_SIZE } from "@solana/spl-token";
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { TokenMetadata, pack } from "@solana/spl-token-metadata";
import { PublicKey, Keypair } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";

const CLUSTER_URL = process.env.RPC_URL ?? web3.clusterApiUrl("devnet");
const connection = new web3.Connection(CLUSTER_URL, { commitment: "finalized" });


export function generateKeyPair() {
    const keypair = web3.Keypair.generate();
    return keypair;

    // console.log('Public key:', keypair.publicKey.toBase58());
    // console.log('Private key:', keypair.secretKey.toString('hex'));
}


export async function buildCreateTokenTransaction(tokenConfig: TokenMetadata, payerPublicKey: PublicKey, mintKeypair: Keypair, supply: number) {
    const EXTENSIONS = [ExtensionType.MetadataPointer];
    const mintSpace = getMintLen(EXTENSIONS);
    const metadataSpace = TYPE_SIZE + LENGTH_SIZE + pack(tokenConfig).length
    const lamports = await connection.getMinimumBalanceForRentExemption(mintSpace + metadataSpace)

    // get associated token account
    let ata = await getAssociatedTokenAddress(mintKeypair.publicKey, payerPublicKey, false, TOKEN_2022_PROGRAM_ID);

    // register the address token will be deployed at
    const createMintAccountInstruction = web3.SystemProgram.createAccount({
        fromPubkey: payerPublicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintSpace,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
    });


    // instruction that creates a pointer to where the metadata is stored
    const initMetadataPointerInstruction = createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        payerPublicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID,
    );

    // instruction to deploy token program to mint account address
    const initMintInstruction = createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        payerPublicKey,
        payerPublicKey,
        TOKEN_2022_PROGRAM_ID
    );

    // instruction to store the metadata
    const initMetadataInstruction = createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        metadata: mintKeypair.publicKey,
        updateAuthority: payerPublicKey,
        mint: mintKeypair.publicKey,
        mintAuthority: payerPublicKey,
        name: tokenConfig.name,
        symbol: tokenConfig.symbol,
        uri: tokenConfig.uri,
    });

    // create associated token account
    const createAssociatedTokenAccountIx = createAssociatedTokenAccountInstruction(
        payerPublicKey,
        ata,
        payerPublicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
    )

    // mint token to account
    let mintTokenInstruction = createMintToCheckedInstruction(
        mintKeypair.publicKey,
        ata,
        payerPublicKey,
        supply,
        9,
        [],
        TOKEN_2022_PROGRAM_ID
    )

    // let signers = [payer, mintKeypair];
    const transaction = new web3.Transaction().add(
        createMintAccountInstruction,
        initMetadataPointerInstruction,
        initMintInstruction,
        initMetadataInstruction,
        createAssociatedTokenAccountIx,
        mintTokenInstruction
    );
    transaction.feePayer = new PublicKey(payerPublicKey);
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    return transaction;
}