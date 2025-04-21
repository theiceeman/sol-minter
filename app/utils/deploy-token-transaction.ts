import { createInitializeMintInstruction, createMintToCheckedInstruction, createInitializeInstruction, TOKEN_2022_PROGRAM_ID, createInitializeMetadataPointerInstruction, ExtensionType, getMintLen, TYPE_SIZE, LENGTH_SIZE, createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";
import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { TokenMetadata, pack } from "@solana/spl-token-metadata";
import { PublicKey, Keypair } from "@solana/web3.js";
import * as web3 from "@solana/web3.js";
import { iSupportedNetwork, loadConnection } from "./web3-solana";

// const CLUSTER_URL = process.env.RPC_URL ?? web3.clusterApiUrl("devnet");
// const connection = new web3.Connection(CLUSTER_URL, { commitment: "finalized" });


export function generateKeyPair() {
    const keypair = web3.Keypair.generate();
    return keypair;
}


export async function buildCreateTokenTransaction(
    network: iSupportedNetwork,
    tokenConfig: TokenMetadata,
    payerPublicKey: PublicKey,
    mintKeypair: Keypair,
    supply: number
) {

    const connection = loadConnection(network);
    if (!connection)
        throw new Error('Please connect wallet.')

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

export async function revokeTokenAuthorities(
    network: iSupportedNetwork,
    mintPublicKey: PublicKey,
    currentAuthority: PublicKey
) {
    const connection = loadConnection(network);
    if (!connection)
        throw new Error('Please connect wallet.')

    const transaction = new web3.Transaction();

    // Revoke mint authority by setting it to null
    const revokeMintAuthorityIx = createSetAuthorityInstruction(
        mintPublicKey,
        currentAuthority,
        AuthorityType.MintTokens, // 0
        null,
        [],
        TOKEN_2022_PROGRAM_ID
    );
    transaction.add(revokeMintAuthorityIx);

    // Revoke freeze authority by setting it to null
    const revokeFreezeAuthorityIx = createSetAuthorityInstruction(
        mintPublicKey,
        currentAuthority,
        AuthorityType.FreezeAccount, // 1
        null,
        [],
        TOKEN_2022_PROGRAM_ID
    );
    transaction.add(revokeFreezeAuthorityIx);

    // Revoke metadata pointer authority
    const revokeMetadataPointerAuthorityIx = createSetAuthorityInstruction(
        mintPublicKey,
        currentAuthority,
        AuthorityType.MetadataPointer, // 12
        null,
        [],
        TOKEN_2022_PROGRAM_ID
    );
    transaction.add(revokeMetadataPointerAuthorityIx);

    // Revoke close mint authority
    const revokeCloseMintAuthorityIx = createSetAuthorityInstruction(
        mintPublicKey,
        currentAuthority,
        AuthorityType.CloseMint, // 6
        null,
        [],
        TOKEN_2022_PROGRAM_ID
    );
    transaction.add(revokeCloseMintAuthorityIx);

    transaction.feePayer = currentAuthority;
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

    return transaction;
}