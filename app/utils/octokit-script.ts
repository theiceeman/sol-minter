"use server"

import { iSupportedNetwork, iToken } from "./web3-solana";
const { Octokit } = require("octokit");
const dotenv = require("dotenv")
dotenv.config()

const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN
})

const OWNER = 'theiceeman';
const REPO = 'sol-minter-tokens-metadata';

export async function deployMetadata(token: iToken, network: iSupportedNetwork) {
    try {
        const jsonData = {
            "name": token.name,
            "symbol": token.symbol,
            "description": "To the moon!",
            "image": token.logoUrl
        };
        const fileContent = JSON.stringify(jsonData);
        const prefix = network == iSupportedNetwork.mainnetBeta ? iSupportedNetwork.mainnetBeta : iSupportedNetwork.devnet
        const PATH = `${prefix}/${token.symbol}-${Date.now()}.json`

        const response = await octokit.request('GET /user')
        console.log(`Authenticated as: ${response.data.login}`)

        let result = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: OWNER,
            repo: REPO,
            path: PATH,
            message: `added ${token.name} token on ${network}`,
            committer: {
                name: 'iceeman',
                email: 'okorieebube1@gmail.com'
            },
            content: Buffer.from(fileContent).toString('base64'),
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        })
        return `https://raw.githubusercontent.com/theiceeman/sol-minter-tokens-metadata/main/${PATH}`
        
    } catch (error: any) {
        console.log({ error: error.message })
        throw new Error(error)
    }

}
// run()