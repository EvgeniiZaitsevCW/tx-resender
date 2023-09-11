import { ethers, Provider, Transaction, TransactionResponse } from "ethers";
import { Logger } from "./logger";
import { checkTransaction, getTransactionHashes } from "./utils";

// Script input parameters
const rpcUrlSource: string = process.env.SP_RPC_URL_SOURCE ?? "http://localhost:7545";
const rpcUrlDestination: string = process.env.SP_RPC_URL_DESTINATION ?? "http://localhost:8545/";
const txHashList: string = process.env.SP_TX_HASH_LIST ?? `
0x9cd1a111624f45993193fa5a4907ad73d43d0c809dcd751b7be95275ae364d53
0x1f66558beb2f6d2371e6bd1409002a3dfa8ee88d0d1e6f26128c4179cda0be9e
0x672ba326e12c655f81894c6a78e995ea33be6f20b6f7b446fd739c6af7d979ec
0x833cc1095d727f036bcf33c5df983682075c9175e1c5c9c6a5bad4f4cdb8ddaa
0x3f30097f232f978e781e4b2734f1a2c38406ba7142fb6c554573ddd5b94a6091
0xd364a9f3dbbfe6af2e5b85b8db4082e421977a64aa409deaad07839b9261148a
0x7a57a49081f239f09862b5d0bc9a18b5132ea6ce484f7431debbcef73687b392
0x4d2442fdee6a64b4d207f1f63ca2fed6dbef9ab45b43e25638566fd8d173319a
0xd0e15bfe33b0b59d0d5c95d4d9e0c56199cb49d343aaf98ecf70769091f31fb9
`;

const logSingleLevelIndent = "  ";
const logger: Logger = new Logger(logSingleLevelIndent);

async function main() {
  logger.log(`🏁 Resending transactions ...`);
  logger.increaseLogIndent();
  const txHashes: string[] = getTransactionHashes(txHashList);

  logger.log("👉 The source RPC URL:", rpcUrlSource);
  logger.log("👉 The destination RPC URL:", rpcUrlDestination);
  logger.log("👉 The number of transactions to resend:", txHashes.length);
  logger.logEmptyLine();

  const sourceProvider: Provider = new ethers.JsonRpcProvider(rpcUrlSource);
  const destinationProvider: Provider = new ethers.JsonRpcProvider(rpcUrlDestination);

  const txs: Transaction[] = await fetchTransactions(txHashes, sourceProvider);
  logger.logEmptyLine();
  await sendTransactions(txs, destinationProvider);

  logger.decreaseLogIndent();
  logger.log("🎉 Everything is done.");
}

async function fetchTransactions(txHashes: string[], provider: Provider): Promise<Transaction[]> {
  logger.log("▶ Fetching the transaction data from the source network ...");
  const txs: Transaction[] = [];
  const txTotal = txHashes.length;
  const txTotalFormatted = txTotal.toString();
  logger.increaseLogIndent();
  for (let i = 0; i < txTotal; ++i) {
    if (i != 0) {
      logger.logEmptyLine();
    }
    const txHash: string = txHashes[i];
    const txNumberFormatted = ((i + 1).toString()).padStart(txTotalFormatted.length);
    logger.log(`🏁 Requesting the transaction ${txNumberFormatted} from ${txTotalFormatted} with hash`, txHash, "...");
    const txResponseOrNull: TransactionResponse | null = await provider.getTransaction(txHash);
    const txResponse: TransactionResponse = checkTransaction(txResponseOrNull);
    const tx: Transaction = ethers.Transaction.from(txResponse);
    txs.push(tx);
    logger.log("✔ Done");
  }

  logger.decreaseLogIndent();
  logger.log("✔ All the transactions have been collected successfully");
  return txs;
}

async function sendTransactions(txs: Transaction[], provider: Provider): Promise<Transaction[]> {
  logger.log("▶ Submitting the transactions to the destination network one by one...");
  const txTotal = txs.length;
  const txTotalFormatted = txTotal.toString();
  logger.increaseLogIndent();
  for (let i = 0; i < txTotal; ++i) {
    if (i != 0) {
      logger.logEmptyLine();
    }
    const tx: Transaction = txs[i];
    const txNumberFormatted = ((i + 1).toString()).padStart(txTotalFormatted.length);
    logger.log(`🏁 Sending the transaction ${txNumberFormatted} from ${txTotalFormatted} with hash`, tx.hash, "...");
    await provider.broadcastTransaction(tx.serialized);
    logger.log("✔ Done");
  }

  logger.decreaseLogIndent();
  logger.log("✔ All the transactions have been sent successfully");
  return txs;
}

main().then().catch(err => {
  throw err;
});