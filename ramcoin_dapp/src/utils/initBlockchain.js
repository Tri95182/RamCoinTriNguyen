import RamCoin from "../contract_ABI/RamCoin.json";
import RamSale from "../contract_ABI/RamSale.json";
import { ethers } from "ethers";

//
//  set up the blockchain shadow contract, user address.
//

const initBlockchain = async () => {

    let provider;
    window.ethereum.enable().then(provider = new ethers.providers.Web3Provider(window.ethereum));

    // The provider also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, we need the account signer...

    const signer = await provider.getSigner()
    console.log("signer", signer);
    const userAddress =  await signer.getAddress();
    console.log("user address", userAddress);

    let RC = null;
    console.log("READ RamCoin ABI");
    const RCabi = RamCoin.abi;
    console.log(RCabi);
    RC = new ethers.Contract('0x6F9B6Af1486746d847a5F42C8b7AfdbA524fab5c', RCabi, signer);

    let RS = null;
    console.log("READ RamSale ABI");
    const RSabi = RamSale.abi;
    console.log(RSabi);
    RS = new ethers.Contract('0x4014f1Bcbc6c075E4E26FB9b7a97C3E51B8F9F12', RSabi, signer);

    let data = {
      RS,
      RC,
      RSDeployedAddress: '0x4014f1Bcbc6c075E4E26FB9b7a97C3E51B8F9F12',
        signer,
        userAddress // shorthand
    };

    return data;
}

export default initBlockchain;
