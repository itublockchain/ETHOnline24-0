//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract Wallet{
    
    address public immutable owner;
    IERC20 public usdc;
    
    constructor(address _owner,address token){ //0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 usdc address
        owner=_owner;                           // bu yanlış galiba hocam
        usdc=IERC20(token);
    }

  
    mapping(address=>uint) receivings;
    mapping(address=>uint) balances;
    mapping(address=>bool) claimed;

    
    
    function giveContractAllowance(uint amount) external { //to give the contract allowence to take from sender

        require(msg.sender==owner,"Not the owner!");
        usdc.approve(address(this),amount);

    }
    
    function giveUserAllowance(address receiver,uint amount) internal { //to give claimer the allowence to take from contract

        require(msg.sender==address(this),"Not the contract!");
        usdc.approve(receiver,amount);

    }
    
    function sendToken(address _to,uint amount) internal {
        require(msg.sender==owner,"Not the owner!");
        require(usdc.balanceOf(owner)>=amount,"Insufficent balance");
        require(usdc.allowance(owner,msg.sender)>0,"You don't have the allowence!");

        usdc.transferFrom(owner,address(this),amount); 
        receivings[_to]+=amount;

      

    }

    function claim(address receiver) external {
        require(receiver==msg.sender,"You are not the claimer");
        require(receivings[msg.sender]>0,"You are not eligible!");
        require(!claimed[msg.sender],"Already claimed");

        
        usdc.transferFrom(address(this),msg.sender,receivings[msg.sender]);
        claimed[msg.sender]=true;
        receivings[msg.sender]=0;



    }

}