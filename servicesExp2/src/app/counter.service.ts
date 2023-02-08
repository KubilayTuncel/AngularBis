
export class CounterService {
    activeToInactiveCounter = 0;
    inactiveToActiveCounter = 0;

    incrementActiveToInactive () {
        this.activeToInactiveCounter++;
        console.log("active To Inactive User : "+this.activeToInactiveCounter)
    }

    incrementInactiveToActive() {
        this.inactiveToActiveCounter++;
        console.log("Inactive To Active User : "+this.inactiveToActiveCounter)
    }
}