const Gate_add = class { //or call Neuron //TODO GATE extends Node ?
    constructor(parameters) {
        const presets = {
            id: 'gate',
            rectSize: 60,
            x: 200,
            y: 200,
            from: [],
            level: 2,
            gradient:0
        }
        //presets go on this and parameters override presets
        Object.assign(this, presets, parameters)
        this.x = this.level * 200 + 200;
        this.output = new Node({ //only value transfer at this stage, no reference
            from: this,
            level: this.level + 1,
            gradient: this.gradient,
            x: this.x,
            id: `output`,
            y: this.y, //between the two
            to: [],
            value: 0
        }, 0);
    }

    forward() {
        this.outputVal = this.from.reduce((acc, node) => acc + node.value, 0);

        this.output.value = this.outputVal;
        this.value = this.output.value;

        return this.output;
    }

    backward() {//derivative of xy ref x = x; that's why x ==> y
        // take the gradient in output unit and chain it with the
        // local gradients, which we derived for multiply gate before
        // then write those gradients to those Units.
        //TODO understand that these are all gradients!!!
        //VALUES get changed after a full backprop cycle
        this.from.forEach(node => node.gradient += 1 * this.output.gradient); //f(x) = x + y; f`(x/dx) = 1 -- local gradient chained with outputgradient
    }
}

//TODO BASEgate class ...multiply / addgate as extensions
//TODO GRAPh and nodes and gates only care about linking and graph
// TODO related stuff...x, y coordinates is a map function...value as well. Don't code it in the object....the object does the graph. Then there are valuemapping functions for paths, width etc


//TODO wire is a dead, simple neuron without a functionality...just values and gradient
const Node = class { //saves in object to have memory off variables (assignment by reference)...
    constructor(parameters) {
        const presets = {
            id: null,
            value: 20,
            gradient: 0,
            x: 200,
            y: 200,
            from: [],
            to: [],
            level: null
        }
        //presets go on this and parameters override presets
        Object.assign(this, presets, parameters)
    }

    connectTo(target, source = this) { //by reference attention
        if (this.to.indexOf(target) === -1) {
            this.to.push(target);
        }
        if (target.from.indexOf(source) === -1) {
            target.from.push(source)
            if (!target.level) {
                target.level = source.level + 1
            }
        }

    }
};