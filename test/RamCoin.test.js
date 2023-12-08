const { expect } = require('chai');
const { waffle } = require("hardhat");
const { deployContract } = waffle;
const provider = waffle.provider;

describe("RamCoin", function () {
    // Mocha has four functions that let you hook into the the test runner's
    // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

    // They're very useful to setup the environment for test, and to clean it
    // up after they run.

    // A common pattern is to declare some variables, and assign them in the
    // `before` and `beforeEach` callbacks.

    const _name = 'CSU RamCoin Token 2021';
    const _symbol = 'RAMCOIN21';
    const _decimals = 18;

    let RC;
    let RCInstance;
    let alice;
    let bob;



    // `beforeEach` will run before each test, re-deploying the contract every
    // time. It receives a callback, which can be async.

    beforeEach(async function () {
        [alice, bob] = await ethers.getSigners();
        RC = await ethers.getContractFactory("RamCoin");
        RCInstance = await RC.deploy(_name, _symbol, _decimals);
    });

    describe('token attributes', function() {
        it('has the correct name', async () => {
            const n = await(RCInstance.name());
            await expect(n).to.equal(_name);
        });

        it('has the correct symbol', async () => {
            const sym = await(RCInstance.symbol());
            expect(sym).to.equal(_symbol);
        });

        it('has the correct decimals', async () => {
            const d = await(RCInstance.decimals());
            expect(d).to.equal(_decimals);
        });

        it('has 0 coins minted in the totalSupply', async () => {
            const t = await(RCInstance.totalSupply());
            expect(t).to.equal(0);
        });

    });
});