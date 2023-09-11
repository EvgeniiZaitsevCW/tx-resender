# Tx Re-Sender

## Description

An utility for re-sending bare transactions from one blockchain to another.

It doesn't check that re-sent transactions are minted successfully.

## Steps to run locally

1. Be sure you have NodeJS (at least version 14) and NPM (at least version 6.14) are installed by running:
   ```bash
   node --version
   npm --version
   ```
2. Clone the repository to your machine and switch to the repository directory.

3. Run the installation of dependencies:
   ```bash
   npm install
   ```

4. Configure the input parameters in the `src/index.ts` file or by setting the appropriate environment variables mentioned in the file.

5. Run the main script:
   ```bash
   npx ts-node src/index.ts 
   ```

6. Observe the console output.