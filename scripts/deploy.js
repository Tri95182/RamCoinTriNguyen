async function main() {

    const [deployer] = await ethers.getSigners("localhost:8545");

    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("Account balance:", (await deployer.getBalance()).toString());

    // utility routine for setting seconds in various time units

    const duration = {
        seconds: function (val) { return val },
        minutes: function (val) { return val * this.seconds(60); },
        hours: function (val) { return val * this.minutes(60); },
        days: function (val) { return val * this.hours(24); },
        weeks: function (val) { return val * this.days(7); },
        years: function (val) { return val * this.days(365); },
    };

    // deploy the RAMCOIN contract with its constructor variables

    const _name = "CSU RamCoin 2021";
    const _symbol = "RAMCOIN21";
    const _decimals = 18;

    const RCF = await ethers.getContractFactory("RamCoin");
    const RC = await RCF.deploy(_name, _symbol, _decimals);
    console.log("Ramcoin contract address:", RC.address);

    // deploy the crowdsale contract "RamSale" with its constructor variables

    //const latestTime = Math.ceil( (new Date()).getTime() / 1000 );  // freakin' milliseconds screws things up
    const rightNow = (new Date()).getTime();
    const latestTime = Math.round( rightNow / 1000 );
    console.log("now", latestTime);

    const _rate           = 500;
    const _initialRate    = 500;
    const _finalRate      = 200;
    const _wallet         = "0xBd08bbd472750F6755feA4369C71fa79CBAA48f8";  // joe metamask account 3  or   deployer.address;  // accounts[0];
    const _token          = RC.address;
    console.log("wallet to receive ether:", _wallet);

    const _openingTime    = latestTime + duration.minutes(1);
    console.log("open", _openingTime);
    const _closingTime    = _openingTime + duration.weeks(1);
    console.log("closing", _closingTime);
    const _cap            = ethers.utils.parseEther("400");  // ether(400);
    const _goal           = ethers.utils.parseEther("100");  // ether(100);
    console.log("cap and goal", _cap, _goal);
    //const _foundersFund   = accounts[0]; // TODO: Replace me
    //const _foundationFund = accounts[0]; // TODO: Replace me
    //const _partnersFund   = accounts[0]; // TODO: Replace me
    const _releaseTime    = _closingTime + duration.minutes(1);

    const RSF = await ethers.getContractFactory("RamSale");
    const RS = await RSF.deploy(_rate, _wallet, _token, _initialRate, _finalRate, _cap, _openingTime, _closingTime);
    console.log("Ramsale contract address:", RS.address);

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

/*
npx hardhat run --network rinkeby scripts/deploy.js
Deploying contracts with the account: 0x4327D8b79AB0499F81dD801db4365CdC914d6f3f
Account balance: 2004048018775582807
Ramcoin contract address: 0x2eF5D3Bc563990EC31F5114434bb5e6AD426991B
now 1616265228
open 1616265348
closing 1616870148
cap and goal BigNumber { _hex: '0x15af1d78b58c400000', _isBigNumber: true } BigNumber { _hex: '0x056bc75e2d63100000', _isBigNumber: true }
Ramsale contract address: 0xF19454323A5518DA4E8756A98d7f9Ee3F756A3d9



April 5 morning: class deployment

npx hardhat run --network rinkeby scripts/deploy.js
Deploying contracts with the account: 0x4327D8b79AB0499F81dD801db4365CdC914d6f3f
Account balance: 5996310509775582807
Ramcoin contract address: 0x6F9B6Af1486746d847a5F42C8b7AfdbA524fab5c
now 1617632850
wallet to receive ether: 0xBd08bbd472750F6755feA4369C71fa79CBAA48f8
open 1617632910
closing 1618237710
cap and goal BigNumber { _hex: '0x15af1d78b58c400000', _isBigNumber: true } BigNumber { _hex: '0x056bc75e2d63100000', _isBigNumber: true }
Ramsale contract address: 0x4014f1Bcbc6c075E4E26FB9b7a97C3E51B8F9F12
(base) Macbook-Pro:RamCoin2021 jgersch$


*/