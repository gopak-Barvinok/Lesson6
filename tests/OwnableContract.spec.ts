import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { OwnableContract } from '../wrappers/OwnableContract';
import '@ton/test-utils';

describe('OwnableContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let ownableContract: SandboxContract<OwnableContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        ownableContract = blockchain.openContract(await OwnableContract.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await ownableContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: ownableContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and ownableContract are ready to use
    });
});
