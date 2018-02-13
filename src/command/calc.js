import math from 'mathjs'

export default class Calc {
    constructor() {
        this.texts = ['Maybe', "I think it's", 'Probably']
    }

    handle(command) {
        if (command.length < 2) {
            return ':angry: are you kidding me? what should I calculate?'
        }

        const expression = command.slice(1).join(' ')

        let result

        try {
            result = `${this.randomText} ${math.eval(expression).toString()}`
        } catch (error) {
            result = ":confused: Hmm... that's weird. I can't calculate that"
        }

        return result
    }

    get randomText() {
        return this.texts[Math.floor(Math.random() * this.texts.length)]
    }
}
