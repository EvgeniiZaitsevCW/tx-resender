import { TransactionResponse } from "ethers";

export function getTransactionHashes(content: string): string[] {
  let txHashes: string[] = content.match(/[0-9a-f]{64}([^0-9a-f]|$)/ig) ?? [];
  txHashes = txHashes.map(txHash => "0x" + txHash.toLowerCase().substring(0, 64));
  return txHashes;
}

export function checkTransaction(
  txResponse: TransactionResponse | null,
): TransactionResponse {
  if (!txResponse) {
    throw new Error("The transaction with the provided hash does not exist");
  }
  return txResponse;
}