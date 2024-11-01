import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CurrentItemAndRandom } from '../wrappers/CurrentItemAndRandom';
import '@ton/test-utils';

const THE_GREAT_CONJUCTION_2077: number = 3407270400;

describe('CurrentItemAndRandom', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let currentItemAndRandom: SandboxContract<CurrentItemAndRandom>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        currentItemAndRandom = blockchain.openContract(await CurrentItemAndRandom.fromInit());

        deployer = await blockchain.treasury('deployer');

        blockchain.now = THE_GREAT_CONJUCTION_2077;

        const deployResult = await currentItemAndRandom.send(
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
            to: currentItemAndRandom.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and currentItemAndRandom are ready to use
    });

    it("should wait 10 sec", async ()=>{
        await currentItemAndRandom.send(deployer.getSender(),
        {
            value: toNano("0.2")
        }, 'wait 10s')

        blockchain.now = THE_GREAT_CONJUCTION_2077 + 11000;

        await currentItemAndRandom.send(deployer.getSender(),
        {
            value: toNano("0.2")
        }, 'wait 10s')
    });

    it("should show random", async () => {
        const randomInt = await currentItemAndRandom.getRand();
        console.log(randomInt);
        const random = await currentItemAndRandom.getRandBetween(-10n, 10n);
        console.log(random);

        const unixTime = await currentItemAndRandom.getUnixTime();

        console.log(unixTime);
    });
});