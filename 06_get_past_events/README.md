# 06 Get and search past events

```
Continue from chapter 05...
```

We can not only listen to the incomming events, query past events is also possible. Let's take a look!

## Get past events

In our HTML we have a new button `Get Past Events`. When it's clicked, we get all the past events of `UpdateNumber`. 
- We are able to query events within a range of blcoks. Or use `{ fromBlock: '0', toBlock: 'latest' }` to get events from all blocks
- `updateHTML` is a function to update event entries in HTML. You can find it at the top of the `app.js`

```js
// Get all past "UpdateNumber" events
const getPastButton = document.getElementById('getPast');
getPastButton.onclick = async () => {
  const events = await contractReader.getPastEvents(
    'UpdateNumber', 
    {
      fromBlock: '0',
      toBlock: 'latest',
    }
  );
  console.log('past event: ', events);
  updateHTML(events);
}
```

Isn't that easy? :D

## Query events with filter

There are few benefits we gain from saving data into events:
- Save gas! Let's say we want to save 1 byte of data, how much would it cost?
  - 625 gas in contract storage
  - 8 gas as event log (however logs are not accessible within the contract itself)
- Events has simple indexing mechanism which makes it easier to find the logs we want

Let's take a look of the `UpdateNumber` event in `Hello.sol` contract

```js
event UpdateNumber(uint256 value, address indexed updateBy);
```

The seconded parameter `updateBy` is decorated by the keyword `indexed`. 
- Only indexed parameters can be used for filtering
- Event supports up to 3 indexed parameters

Since `updateBy` is indexed, we can now easily find events with a specific `updateBy`.

```js
// Query events by user address!
const getPastByAccountButton = document.getElementById('getPastByAccount');
getPastByAccountButton.onclick = async () => {
  const address = prompt('please enter the address that you want to search');
  if (address) {
    const events = await contractReader.getPastEvents(
      'UpdateNumber', 
      {
        filter: { 
          updateBy: address,
        },
        fromBlock: '0',
        toBlock: 'latest',
      }
    );
    console.log(`past events from ${address}: `, events);
    updateHTML(events);
  }
}

```

## Filter with multiple value

You can also filter by `OR` condition
```js
const events = await contractReader.getPastEvents(
      'UpdateNumber', 
      {
        filter: { 
          // If updateBy matches one of ["address1", "address2"]
          updateBy: [address1, address2],
        },
        fromBlock: '0',
        toBlock: 'latest',
      }
    );
```

It will returns event logs which `updatedBy` is equal to `address1` or `address2`. Please be noted that:
- Only `OR` is supportted
- You cannot do `>=`, `<`, `!==`, etc..
