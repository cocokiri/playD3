const Graph = class{
    constructor(matrix) {
        this.stepSize = 0.01;

        this.matrix = matrix;
        this.matrix[this.matrix.length-1][0].gradient = 1; //output gradient
        this.connectLayers()
    }
    connectLayers(matrix = this.matrix) {
        matrix.forEach(function (layer, idx) {
            if (idx >= matrix.length - 1) {
                return
            }
            layer.forEach(function (node) {
                matrix[idx + 1].forEach(next => node.connectTo(next, node))
            }) //connects all nodes with all gates next layer
        })
        return this
    }
    forwardPassAll(matrix = this.matrix) { //all gates call forward()
        //
        for (let i = 1; i < matrix.length; i++) {
            matrix[i].forEach(gate => gate.forward())
        }
        return this
    }

    backwardPassAll(matrix = this.matrix) {
        for (let i = matrix.length - 1; i >= 1; i--) { //skip last (inputlayer nodes)
            const layer = matrix[i]
            layer.forEach(gate => gate.backward())
        }
        return this
    }
    adjustInputsToGradient(matrix = this.matrix) {
        const that = this;
        matrix.forEach(layer => layer.forEach(function (node) {
                node.value += that.stepSize * node.gradient
            })
        )
        return this;

    }
}