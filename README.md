# Ethers Js Wallet Connect Modal

The following is a wallet connect modal using ethers js.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser. \

Connect Wallet opens up the modal where you are given 5 different web3 provider options. Once a wallet has been connected using a web3 provider there is an example of performing a transaction (Minting 1000 tokens) as well as fetching data from the blockchain (Displaying token balance).

## Web3Provider.js
`
const [currentAccountAddress, setCurrentAccountAddress] = useState("");\
const [web3, setWeb3] = useState({ \
  initialized: false, \
\
  metamaskProvider: null, \
  web3Provider: null, \
\ 
  networkId: 1, \
\
  tokenContract: null, \
});` \

The above instance the necassary information needed to interact with the blockchain. If you have more contracts that need to be instanced add them, in the web3 object. \

## web3Setups

within the Web3Provider.js you may notice that there are functions that are provided with ('name of web3Provider)setup. Calling this will take the correct action to setup the web3 object using the web3 provider chosen. Please put in your own infura or api keys when forking this. The app.js is wrapped in this provider and these web3setups are passed down as well as the web3 object (with instanced contracts) and the current account address.

## Api keys

Add your own api keys in here. \

`
const Web3Provider = ({ children }) => { \
\
  // Please put your own ids/api keys here \
  const INFURAID = '1931cc544071487293147adbe8fadeb9'; \
  const FORTMATICID = "pk_live_522E2B32F46FB16A"; \
  const PORTISID = "12f64063-f3e7-4bed-bb31-8c6dd697867b"; \
`

## Using the web3 provider context

In your react component include \

`
let web3Context = useContext(_web3Context);
`

now you can access instanced contracts, current account address and the web3 setups (for each respective web3 provider) with this object.

## Dependencies

Below are the dependencies you will need to utilize each web3 provider. run ` yarn add <dependency> ` to add them. \

`
Metamask: "@metamask/detect-provider"; \
WalletConnect: "@walletconnect/web3-provider"; \
Portis: "@portis/web3"; \
Fortmatic: "fortmatic"; \
MewConnect: '@myetherwallet/mewconnect-web-client' \
`

