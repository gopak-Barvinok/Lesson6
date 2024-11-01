import "@stdlib/deploy";
import "@stdlib/ownable";

trait Trackeble with Ownable {
    numMessagesReceived: Int;
    owner: Address;

    virtual const ENABLE_RESET: Bool = true;

    fun receiveNewMessage() {
        if(self.filterMessage()) {
            self.numMessagesReceived = self.numMessagesReceived + 1;
        }
    }

    receive("reset stats") {
        if(self.ENABLE_RESET) {
            self.requireOwner();
            self.numMessagesReceived = 0;
            self.reply("reset done".asComment());
        }
    }

    get fun stats(): Int {
        return self.numMessagesReceived;
    }

    virtual fun filterMessage(): Bool {
        if(sender() == self.owner) {
            return false;
        }

        return true;
    }
}

message Add {
    queryId: Int as uint64;
    amount: Int as uint32;
}

contract TrackebleCounter with Deployable, Trackeble {
    id: Int as uint32;
    counter: Int as uint32;
    numMessagesReceived: Int as uint32;
    owner: Address;
    override const ENABLE_RESET: Bool = false;

    init(id: Int) {
        self.id = id;
        self.counter = 0;
        self.numMessagesReceived = 0;
        self.owner = sender();
    }

    receive(msg: Add) {
        self.receiveNewMessage();
        self.counter += msg.amount;

        // Notify the caller that the receiver was executed and forward remaining value back
        self.notify("Cashback".asComment());
    }

    get fun counter(): Int {
        return self.counter;
    }

    get fun id(): Int {
        return self.id;
    }

    override fun filterMessage(): Bool {
        return true;
    }
}
