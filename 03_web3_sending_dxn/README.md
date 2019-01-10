# 03 Sending DXN


## Add payable function in smart contract

Check out our `Hello.sol`, we've edited a bit
```js
event receivedFund(uint256 value, address sender);
function funding() public payable {
    emit receivedFund(msg.value, msg.sender);
}
```

We've added a `payable` function which emitts an event when receving payment.

## In Dapp, add a button top check contract balance

In HTML, there's a button with id `check` which we should use to bind our function
```js
/**
  "Check contract balance" button
  */
const checkBalanceButton = document.getElementById('check');
checkBalanceButton.onclick = async () => {
    // Get balance in Dei
    const balance = await httpHandler.eth.getBalance(address);
    console.log(`Contract balance in dei: ${balance}`);
    // Covert from Dei to DXN
    const balanceInDXN = Web3.utils.fromWei(balance);
    console.log(`Contract balance in DXN: ${balanceInDXN}`);
    alert(`Contract balane: ${balanceInDXN} DXN`);
}
```

When we read account balance on DEXON, returned value is in dei
```js
1 DXN = 10^18 Dei
```

Web3 provides utils from convert between DXN and Dei
- Web3.utils.fromWei
- Web3.utils.toWei

Again, Web3 is maintained by Ethereum foundation and in Ethereum the smallest unit is `Wei`
```js
 1 Wei = 1 Dei
```

## Send DXN to contract via payable function

Same as above, when we send DXN we should use `dei` as unit

```js
/**
  send DXN nutton
  */
const sendButton = document.getElementById('send');
sendButton.onclick = async () => {
  const amount = prompt('How much DXN do u want to pay');
  console.log(`You want to pay ${amount} DXN`);
  /**
    We should transform the unit from DXN to Dei
    1 Dei = 1 Wei 
    1 Dxn = 1000000000000000000 Dei
    */
  const amountInDei = Web3.utils.toWei(amount);
  console.log('This is how much we should pay in wei', amountInDei);
  await helloContract.methods.funding().send({
    from: myAccount,
    value: amountInDei,
  });
}
```
