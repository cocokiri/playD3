const GradientLineAnim = class {
    constructor(color, container, suffix=0) {
        this.container = container;

        this.grad1 = this.container.append('defs').append("linearGradient")
            .attr("id", "gradientDown" + suffix)
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "100%").attr("y2", "0%");

        this.grad1.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", color)
            .attr("stop-opacity", 0.8);
        this.stop1 = this.grad1.append("stop")
            .attr('offset', '40%')
            .attr('class', 'gradstart' + suffix)
            .attr("stop-color", color)
            .attr("stop-opacity", 0.8);


        this.stop2 = this.grad1.append("stop")
            .attr('offset', '50%')
            .attr('class', 'gradmiddle' + suffix)
            .attr("stop-color", "white")
            .attr("stop-opacity", 1);

        this.stop3 = this.grad1.append("stop")
            .attr('offset', '60%')
            .attr('class', 'gradend'+ suffix)
            .attr("stop-color", color)
            .attr("stop-opacity", 0.8);
        this.grad1.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", color)
            .attr("stop-opacity", 0.4);

        //second gradient
        this.grad2 = this.container.append("defs")


        this.grad2.append("linearGradient")
            .attr("id", "gradientUp"+suffix)
            .attr("x1", "0%").attr("y1", "100%")
            .attr("x2", "0%").attr("y2", "0%")
            .attr('xlink:href', "#gradientDown" + suffix)
    }

    animateGradient(direction = 'forward', animTime = 1000) {
        let that = this;
        let frames = 20;
        let units = animTime / frames;
        let timer = 0;

        return new Promise(function (resolve, reject) {
            const anim = window.setInterval(function () {
                let director = 0;
                if (direction === 'forward') {
                    timer++;
                }
                else {
                    timer--;
                    director = 100;
                }
                const perc = timer / units * 100;
                that.stop1.attr("offset", director + perc + '%')
                that.stop2.attr("offset", director + perc - 25 + '%')
                that.stop3.attr("offset", director + perc + 25 + '%')


                if (Math.abs(timer) > units) {
                    window.clearInterval(anim)
                    resolve()
                }
            }, frames)
        })
    }
}
