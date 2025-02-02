const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("TokenModule", (m:any) => {
    // constructor params

    const dex = m.contract("DecentralizedExchange");

    return {dex};
});

module.exports = TokenModule;