//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Token is ERC20{
    constructor() ERC20("dollar","USDC"){
        _mint(msg.sender,1000 * 10 ** 18);
    }


}
