import math from 'mathjs'

export default class Calc {
    constructor() {
        this.INFO = {
            command: 'calc',
            description: 'perform math calculation'
        }

        this.limitedEval = math.eval

        math.import(
            {
                createUnit() {
                    throw new Error('Function createUnit is disabled')
                },
                parse() {
                    throw new Error('Function parse is disabled')
                },
                simplify() {
                    throw new Error('Function simplify is disabled')
                },
                derivative() {
                    throw new Error('Function derivative is disabled')
                }
            },
            { override: true }
        )

        this.VARIABLE = {
            emptyExpression:
                ':angry: are you kidding me? what should I calculate?',
            calculationError:
                ":confused: Hmm... that's weird. I can't calculate that"
        }
        this.texts = ['Maybe', "I think it's", 'Probably']
    }

    async handle(command) {
        if (command.length < 1) {
            return this.VARIABLE.emptyExpression
        }

        const expression = command.join(' ').replace(/['"]+/g, '')

        try {
            const result = await this.limitedEval(expression).toString()

            return `${this.randomText} ${result}`
        } catch (error) {
            return error.message
        }
    }

    get randomText() {
        return this.texts[Math.floor(Math.random() * this.texts.length)]
    }
}
