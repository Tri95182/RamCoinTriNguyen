require("@nomiclabs/hardhat-waffle");

const INFURA_PROJECT_ID = "something or other";
const RINKEBY_PRIVATE_KEY = "something else";

task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    paths: {
        sources: "./contracts",
        artifacts: "./artifacts",
    },
    solidity: "0.4.24",
    networks: {
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
            accounts: [`0x${RINKEBY_PRIVATE_KEY}`]
        },
        ganache: {
            url: "http://localhost:8545"
        }
    }
};


// to deploy dapp to CSU with content security policy you have to
// INLINE_RUNTIME_CHUNK=false npm run build
// or else you get inline script policy violations and it won't work