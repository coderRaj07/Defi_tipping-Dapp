##Deploying smartcontracts on local testnets using remix
open and select injected web3 in remix 
select the prefered testnet and deploy (This dapp is deployed on Goerli test network)

##to create next app
npx create-next-app@latest


##Inside the next-app folder created(By default my-app)##

##to install web3modals and ethersjs
npm install web3modal 
npm install ethers

##to run the project
npm run dev

##create constant folder-> 
inside it create index.js->
inside it store deployed contract address value and abi

##ChainID and NetworkID
https://besu.hyperledger.org/en/stable/public-networks/concepts/network-and-chain-id/

##integrate bootstrap to nextjs
https://dev.to/anuraggharat/adding-bootstrap-to-nextjs-39b2

##to speedup the process use html to jsx converter(to use bootstrap elements in next)
https://transform.tools/html-to-jsx

##Changing of tags manually (to use bootstrap elements in next)
<div class=''> to <div className=''> 
<label for=""> to <label htmlFor=""> 
<input> to <input/>

##To avoid ESLint error during deployment copypaste the code given in the link in "next.config.js"
https://nextjs.org/docs/api-reference/next.config.js/ignoring-eslint
