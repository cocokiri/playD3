//TODO BASEgate class ...multiply / addgate as extensions
const Node = class { //saves in object to have memory off variables (assignment by reference)...
    constructor(parameters) {
        const presets = {
            id: 'neuron',
            value: 20,
            rectSize: 60,
            gradient: 0,
            x: 200, //TODO factor out ...visual representation is confusing for graph logic
            y: 200,
            from: [],
            to: [],
            level: 0
        }

        //presets go on this and parameters override presets
        Object.assign(this, presets, parameters)
        this.x = this.level * 200 + 200;

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
        return this;
    }

};

class Gate extends Node { //TODO otherwise all methods are inside 1 node class...multgate, addgate, tanh
    constructor(parameters) {
        super();
        Object.assign(this, parameters)
        this.x = this.level * 200 + 200;

    }

    forward() {
        if (this.from.length < 1) {
            console.warn('forward on node without inputs??')
        }
        this.value = this.from.reduce((acc, node) => acc + node.value, 0);
        return this;
    }

    backward() {//derivative of xy ref x = x; that's why x ==> y
        // take the gradient in output unit and chain it with the
        // local gradients, which we derived for multiply gate before
        // then write those gradients to those Units.
        //TODO understand that these are all gradients!!!
        //VALUES get changed after a full backprop cycle
        this.from.forEach(node => node.gradient += 1 * this.gradient); //f(x) = x + y; f`(x/dx) = 1 -- local gradient chained with outputgradient
        return this;
    }
}

class SigGate extends Gate {
    constructor(parameters) {
        super();
        Object.assign(this, parameters)
        this.x = this.level * 200 + 200;
        this.value;
    }

    sigFn(x) {
        return 1 / (1 + Math.exp(-x)).toFixed(2);
    }

    forward() {
        if (this.from.length > 1) {
            console.error('Sigmoid gate with to many inputs')
        }
        this.value = this.sigFn(this.from[0].value);
        return this;
    }

    backward() {
        const s = this.sigFn(this.value);

        this.from[0].gradient += (s * (1 - s)) * this.gradient;
    }
}

class MultGate extends Gate {
    constructor(parameters) {
        super();
        Object.assign(this, parameters)
        this.x = this.level * 200 + 200;
    }
    forward() {
        if (this.from.length < 1) {
            console.warn('forward on node without inputs??')
        }
        this.value = this.from.reduce((acc, node) => acc * node.value, 1);
        return this;
    }
    backward() {
        const that = this;
        this.from.forEach((node,idx) => {
            const derivative = that.arrayProductExcludeIdx(that.from, idx);
            node.gradient += derivative * that.gradient
        }); //f(x) = x + y; f`(x/dx) = 1 -- local gradient chained with outputgradient
        return this;
    }
    arrayProductExcludeIdx(arr, idx = 0) { //multiply everything except me (derivative) for product
        return arr.reduce(function(acc, val, i) {
            if (i !== idx) {
                return acc * val.value
            }
            else {
                return 1
            }
        }, 1)
    }
}