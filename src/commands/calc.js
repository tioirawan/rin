import Rin from '../core/rin'
import math from 'mathjs'

export default class Calc {
    constructor() {
        this.INFO = {
            command: 'calc',
            description: 'perform math calculation',
            standarize: true
        }

        this.limitedEval = math.eval

        this.VARIABLE = {
            emptyExpression: 'are you kidding me? what should I calculate?',
            calculationError: "Hmm... that's weird. I can't calculate that"
        }
        this.texts = ['Maybe', "I think it's", 'Probably']
    }

    async handle(command) {
        const expression = command.join(' ').replace(/['"]+/g, '')

        if (Rin.isEmpty(expression)) return this.VARIABLE.emptyExpression

        try {
            const result = await this.limitedEval(expression).toString()

            return `${this.randomText} ${result}`
        } catch (err) {
            return err.message
        }
    }

    get randomText() {
        return this.texts[Math.floor(Math.random() * this.texts.length)]
    }
}
