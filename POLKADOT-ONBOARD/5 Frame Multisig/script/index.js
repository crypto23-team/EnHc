const { ApiPromise, Keyring, WsProvider } = require('@polkadot/api');
const { encodeMultiAddress } = require('@polkadot/util-crypto');
const inquirer = require("inquirer");
const polkajspUnit = BigInt(1000000000000);

const WsP = new WsProvider('ws://localhost:9944');

async function dataSinSen(account, tx) {
    return new Promise((resolve, reject) => {
        tx.signAndSend(account, (result) => {
            console.log("Transaction Status" + result.status.type);

            if (result.status.isFinalized) {
                resolve(result);
            }
            else if (
                result.status.isDropped ||
                result.status.isInvalid ||
                result.status.isUsurped
            ) {
                console.error("Transaction Could Not Be Finalized");
                reject(result);
            }
        });
    });
}

async function dataBalance(api, address) {
    return (await api.query.system.account(address)).data;
}

async function dataMultisig(api, address, txHash) {
    return await api.query.multisig.multisigs(address, txHash);
}

async function main() {
    const api = await ApiPromise.create({
        provider: WsP,
        types: {
            Address: 'AccountId',
            LookupSource: 'AccountId'
        },
    });

    const keyring = new Keyring({ type: "sr25519" });
    const accounts = {
        Alice: keyring.addFromUri("//Alice"),
        Bob: keyring.addFromUri("//Bob"),
        Charlie: keyring.addFromUri("//Charlie"),
        Dave: keyring.addFromUri("//Dave"),
        Eve: keyring.addFromUri("//Eve"),
        Ferdie: keyring.addFromUri("//Ferdie"),
    };

    console.log();

    const tfRan = (
        await inquirer.prompt([
            {
                name: "tfRan",
                type: "list",
                message: "Transfer From: ",
                choices: Object.keys(accounts)
                    .map((key => {
                        return `${key}`;
                    })),
            },
        ])
    ).tfRan
    const tfRanAddress = accounts[tfRan].address;

    const signatories = (
        await inquirer.prompt([
            {
                name: "signatories",
                type: "checkbox",
                message: "Signatories: ",
                choices: Object.keys(accounts)
                    .filter((key) => tfRan !== key)
                    .map((key) => {
                        return `${key}`;
                    }),
            },
        ])
    ).signatories;
    const signatoryAddresses = signatories.map((signatory) => accounts[signatory].address);

    const tfRanTo = (
        await inquirer.prompt([
            {
                name: "tfRanTo",
                type: "list",
                message: "Transfer To: ",
                choices: Object.keys(accounts)
                    .filter((key) => tfRan !== key && !signatories.includes(key))
                    .map((key => {
                        return `${key}`;
                    })),
            },
        ])
    ).tfRanTo;
    const tfRanToAddress = accounts[tfRanTo].address;
    const threshold = (
        await inquirer.prompt([
            {
                name: "threshold",
                type: "number",
                message: "Threshold: ",
            },
        ])
    ).threshold;

    const amount = (
        await inquirer.prompt([
            {
                name: "amount",
                type: "number",
                message: "Amount: ",
            },
        ])
    ).amount;

    console.log("Transfer To " + tfRanTo)+ " \nAddress Balance Before transaction: " + (await dataBalance(api, tfRanToAddress).free);

    const multisigAddress = encodeMultiAddress(signatoryAddresses.concat(tfRanAddress), threshold, 42);

    console.log("Multisig Address: " + multisigAddress);

    console.log("\nMultisig address before transfer: " + (await dataBalance(api, multisigAddress)).free);

    const txInit = api.tx.balances.transfer(multisigAddress, BigInt(amount) * polkajspUnit);
    await dataSinSen(accounts[tfRan], txInit);

    console.log("Multisig address after trasnfer: " + (await dataBalance(api, multisigAddress)).free);

    console.log("\n -- FetchingData --");

    const tx = api.tx.balances.transfer(tfRanToAddress, BigInt(amount) * polkajspUnit);
    const txHash = tx.method.hash;
    const txData = tx.method.toHex();

    console.log(" Tx Hash: " + txHash);
    console.log(" Tx Data: " + txData);

    console.log("\nTransaction acceptedby " + tfRan);

    const txtfRanTo = api.tx.multisig.approveAsMulti(threshold, signatoryAddresses, null, txHash, polkajspUnit);
    await dataSinSen(accounts[tfRan], txtfRanTo);

    const multisig = await dataMultisig(api, multisigAddress, txHash);
    const timepoint = multisig.unwrap().when;


    for(let i = 0; i < signatories.length; i++) {
        console.log("\nTransaction acceptedby " + signatories[i]);
        
        const filteredSignatoryAddresses = signatoryAddresses.slice(0, i)
            .concat(signatoryAddresses.slice(i+1, signatoryAddresses.length))
            .concat(tfRanAddress);
        const txSignatory = api.tx.multisig.asMulti(threshold, filteredSignatoryAddresses, timepoint, txData, false, polkajspUnit);
        await dataSinSen(accounts[signatories[i]], txSignatory);
    }

    console.log(tfRanTo + " Address balances after transaction:" + (await dataBalance(api, tfRanToAddress)).free);
}

main()
    .catch(console.error)
    .finally(() => process.exit());