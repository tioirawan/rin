import math from 'mathjs'

export default class Calc {
    constructor() {
        this.limitedEval = math.eval

        math.import(
            {
                import: function() {
                    throw new Error('Function import is disabled')
                },
                createUnit: function() {
                    throw new Error('Function createUnit is disabled')
                },
                eval: function() {
                    throw new Error('Function eval is disabled')
                },
                parse: function() {
                    throw new Error('Function parse is disabled')
                },
                simplify: function() {
                    throw new Error('Function simplify is disabled')
                },
                derivative: function() {
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

    handle(command) {
        if (command.length < 2) {
            return this.VARIABLE.emptyExpression
        }

        const expression = command
            .slice(1)
            .join(' ')
            .replace(/['"]+/g, '')

        let result

        try {
            result = `${this.randomText} ${this.limitedEval(
                expression
            ).toString()}`
        } catch (error) {
            result = this.VARIABLE.calculationError
        }

        return result
    }

    get randomText() {
        return this.texts[Math.floor(Math.random() * this.texts.length)]
    }
}
