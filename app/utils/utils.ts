import base58 from "bs58";
/**
 * convert secret key to readable base58.
 * @param {Uint8Array} secretKey
 */
export function convertUint8ToBs58(secretKey: Uint8Array) {
    const base58String = base58.encode(Buffer.from(secretKey));
    // console.log({ base58String })
    return base58String;
}
// convertToBs58(secretKey);