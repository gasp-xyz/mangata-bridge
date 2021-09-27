
const BigNumber = require('bignumber.js');
const EthERC20Client = require('./ethclient').EthERC20Client;
require("dotenv").config();


(async () => {
    
    let amount = BigNumber(process.env.AMOUNT_TO_LOCK);
    const subNullRecipient = "0x0000000000000000000000000000000000000000";

    let ethClient = new EthERC20Client(process.env.MGA_Kovan_Bridge_INFURA_ENDPOINT_WS, process.env.ERC20AppAddress);
    await ethClient.initialize();

    await ethClient.approveERC20(await ethClient.getUserAccount(), amount, process.env.MgaAddress);
    await ethClient.sendERC20(await ethClient.getUserAccount(), amount, process.env.MgaAddress, subNullRecipient);

    process.exit();
})();