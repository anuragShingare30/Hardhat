// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// @custom:security-contact anuragshingare2000@gmail.com
contract Web3 is ERC20, Ownable {
    constructor()
        ERC20("Web3", "ERC20")
        Ownable(msg.sender)
    {
        _mint(msg.sender, 10000 * 10 ** decimals());
    }
    
}
 