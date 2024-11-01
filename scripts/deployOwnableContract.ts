import { toNano } from '@ton/core';
import { OwnableContract } from '../wrappers/OwnableContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const ownableContract = provider.open(await OwnableContract.fromInit());

    await ownableContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        }
    );

    await provider.waitForDeploy(ownableContract.address);

    // run methods on `ownableContract`
}
