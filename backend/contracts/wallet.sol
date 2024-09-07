//SPDX-License-Identifier:MIT
pragma solidity ^0.8.0;


import "./token.sol";

contract Wallet{
    
    address public immutable sender;
    Token public token;
    uint ID;
    
    constructor(address _tokenAddress){
        token=Token(_tokenAddress);
    }

  
    mapping(uint=>Receiving) public receivings;

    struct Receiving{
        uint amount;
        bool isClaimed;
    }
    
    function giveContractAllowance(uint amount) external { //to give the contract allowence to take from sender

        require(msg.sender==sender,"Not the sender!");
        token.approve(address(this),amount);

    }
    
   
    
    function sendToken(uint _amount) external {
        
        require(token.balanceOf(msg.sender)>=_amount,"Insufficent balance");
        require(token.allowance(msg.sender,address(this))>0,"You don't have the allowence!");

        token.transferFrom(msg.sender,address(this),_amount); 

        Receiving memory sent= Receiving({amount:_amount,isClaimed:false});
        receivings[ID]=sent;
        ID++;

    }

    function claim(address receiver,uint _id) external {
       
        
        require(receiver!=address(0),"Enter a valid address");
        require(receivings[_id].amount!=0,"There is no such receiving");
        require(!receivings[_id].isClaimed,"It is already claimed");


        token.transfer(receiver,receivings[_id].amount);
        receivings[_id].isClaimed=true;
        
        



    }

}