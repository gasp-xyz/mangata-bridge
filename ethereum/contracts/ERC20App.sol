// SPDX-License-Identifier: MIT
pragma solidity >=0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Decoder.sol";
import "./Application.sol";

contract ERC20App is Application {
    using SafeMath for uint256;
    using Decoder for bytes;

    uint64 constant PAYLOAD_LENGTH = 104;

    address public bridge;
    mapping(address => uint256) public totalTokens;

    event AppTransfer(address _sender, bytes32 _recipient, address _token, uint256 _amount);
    event Unlock(bytes _sender, address _recipient, address _token, uint256 _amount);

    function register(address _bridge) public override {
        require(bridge == address(0), "Bridge has already been registered");
        bridge = _bridge;
    }

    function sendERC20(
        bytes32 _recipient,
        address _tokenAddr,
        uint256 _amount
    ) public {
        require(
            IERC20(_tokenAddr).transferFrom(msg.sender, address(this), _amount),
            "Contract token allowances insufficient to complete this lock request"
        );

        // Increment locked ERC20 token counter by this amount
        totalTokens[_tokenAddr] = totalTokens[_tokenAddr].add(_amount);

        emit AppTransfer(msg.sender, _recipient, _tokenAddr, _amount);
    }

    function handle(bytes memory _data) public override {
        require(msg.sender == bridge);
        require(_data.length >= PAYLOAD_LENGTH, "Invalid Payload");

        // Decode sender bytes
        bytes memory sender = _data.slice(0, 32);
        // Decode recipient address
        address recipient = _data.sliceAddress(32);
        // Decode token address
        address tokenAddr = _data.sliceAddress(32 + 20);
        // Decode amount int256
        bytes memory amountBytes = _data.slice(32 + 40, 32);

        uint256 amount = amountBytes.decodeUint256();

        sendTokens(recipient, tokenAddr, amount);
        emit Unlock(sender, recipient, tokenAddr, amount);
    }

    function sendTokens(
        address _recipient,
        address _token,
        uint256 _amount
    ) internal {
        require(_amount > 0, "Must unlock a positive amount");
        require(
            _amount <= totalTokens[_token],
            "ERC20 token balances insufficient to fulfill the unlock request"
        );

        totalTokens[_token] = totalTokens[_token].sub(_amount);
        require(IERC20(_token).transfer(_recipient, _amount), "ERC20 token transfer failed");
    }
}
