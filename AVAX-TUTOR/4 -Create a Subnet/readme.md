##### Frist Terminal

```bash
$ cd $GOPATH/src/github.com/ava-labs/avash
$ ./avash
$ runscript scripts/five_node_staking.lua
```
##### Second Terminal
> Check Bootstrapped Info
```bash
$ curl -X POST --data '{
    "jsonrpc":"2.0",
    "id"     :1,
    "method" :"info.isBootstrapped",
    "params": {
        "chain":"X"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/info
```



> Create Keystore 
```bash
$ curl -X POST --data '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "keystore.createUser",
    "params": {
        "username": "cr23",
        "password": "crypto23Pas_wd"
    }
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/keystore
```



> Create  Address 
```bash
$ curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.createAddress",
    "params": {
        "username": "cr23",
        "password": "crypto23Pas_wd"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```



> Check the list of address
```bash
$ curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.listAddresses",
    "params": {
        "username": "cr23",
        "password": "crypto23Pas_wd"
    },
    "id": 1
}'  -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```

> Result
```bash
{
    "jsonrpc":"2.0",
    "result":{
        "addresses":[
        "P-local1lpytuv3fd64qtdrht0mvrpavgre5qrp282a2hr",
        "P-local1m47695aywj2eerm8ykk9fc39q797lx0hqf306y",
        "P-local1a0k6xjl3e00nc2ff2kxgggukxq476mwhyatypg",
        "P-local1l5unlws3cac4d3pslr2hpezjjf8r890j9fvner",
        "P-local1rwdwuc3mngpaqculdz58xtadhpx8ugj305gp6m",
        "P-local1yqcjp8csexh58sg5llm85apg0l02vmppge8fgd",
        "P-local1j866p8a56q6egclx425sa34macad7e2jcp5c8z"]},
        "id":1
}
```

> Import private key
```bash
$ curl --location --request POST 'localhost:9650/ext/platform' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "platform.importKey",
    "params":{
        "username": "cr23",
        "password": "crypto23Pas_wd",
          "privateKey":"PrivateKey-ewoqjP7PxY4yr3iLTpLisriqt94hdyDFNgchSxGGztUrTXtNN"
    },
    "id": 1
}'
```
> Result
```bash
{"jsonrpc":"2.0","result":{"address":"P-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u00z96u"},"id":1}
```

> Create Subnet
```bash
$ curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.createSubnet",
    "params": {
        "controlKeys":[
        "P-local1lpytuv3fd64qtdrht0mvrpavgre5qrp282a2hr",
        "P-local1m47695aywj2eerm8ykk9fc39q797lx0hqf306y"
        ],
        "threshold":2,
        "username": "cr23",
        "password": "crypto23Pas_wd"
    },
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```
> Result
```bash
{"jsonrpc":"2.0","result":{"txID":"2VN61C7KmqjFJrQ4tT8XQgkwnzFDLJ3hLaxSBitCoXykfLxTYA","changeAddr":"P-local1lpytuv3fd64qtdrht0mvrpavgre5qrp282a2hr"},"id":1}
```
> Get All Subnets
```bash
$ curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getSubnets",
    "params": {},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```
> Result
```bash
{"jsonrpc":"2.0","result":{"subnets":[{"id":"2VN61C7KmqjFJrQ4tT8XQgkwnzFDLJ3hLaxSBitCoXykfLxTYA","controlKeys":["P-local1m47695aywj2eerm8ykk9fc39q797lx0hqf306y","P-local1lpytuv3fd64qtdrht0mvrpavgre5qrp282a2hr"],"threshold":"2"},{"id":"11111111111111111111111111111111LpoYY","controlKeys":[],"threshold":"0"}]},"id":1}
```
> Check Subnets
```bash
$ curl -X POST --data '{
    "jsonrpc": "2.0",
    "method": "platform.getSubnets",
    "params": {"ids":["2VN61C7KmqjFJrQ4tT8XQgkwnzFDLJ3hLaxSBitCoXykfLxTYA"]},
    "id": 1
}' -H 'content-type:application/json;' 127.0.0.1:9650/ext/P
```
> Result
```bash
{
    "jsonrpc":"2.0",
    "result":{
        "subnets":[{"id":
        "2VN61C7KmqjFJrQ4tT8XQgkwnzFDLJ3hLaxSBitCoXykfLxTYA",
        "controlKeys":[
            "P-local1m47695aywj2eerm8ykk9fc39q797lx0hqf306y",
            "P-local1lpytuv3fd64qtdrht0mvrpavgre5qrp282a2hr"
            ],
            "threshold":"2"}]},"id":1
}
```