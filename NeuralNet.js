const NeuralNet = class { //for current example replaceable by [inputs, [1,1], [2]]
    constructor() {
        const nn = {
            inputs: new Array(4).fill(0).map(e => Math.round(Math.random() * 9)),
            hiddenLayerCount: 1,
            gatesPerLayer: 2
        }
        Object.assign(this, nn)
        this.matrix = this.configLayers()
    }
    configLayers() { //abstract ==> just return matrix with column index...later map nodes and gates over it
        const matrix = []
        for (let i = 0; i < this.hiddenLayerCount + 1; i++)  {
            const column = new Array(this.gatesPerLayer).fill(0).map(el => i)
            matrix.push(column)
        }
        matrix.unshift(this.inputs)
        return matrix;

    }
}