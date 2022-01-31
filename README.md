# Ethereum-wallet
-"Ethereum wallet" is a local service REST API custodial wallet application. 

#Requirements
- MySQL
- node.js
- typescript and tsc

#Running the application
-Requires you to create the ethereum_wallet database /database/ethereum_wallet.sql
-** requires you to run "npm install" before running the application to install all dependencies
-create a .env file. Sample of all requirements in .env.SAMPLE
-npm run start - to create a clean build and start the node application
-npm run start:dev - to start the application using the ts-node-dev tool that automatically restarts the node process when a file is modified
