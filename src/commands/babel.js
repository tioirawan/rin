import Rin from '../core/rin'
import { transform } from 'babel-core'
import preset from 'babel-preset-env'

export default class Babel {
    constructor() {
        this.INFO = {
            command: 'babel',
            description: 'compile es6 to es5 using babel',
            standarize: false
        }

        this.VARIABLE = {
            codeEmpty: this.help
        }
    }

    async handle(command) {
        const es6 = command.join(' ').trim()

        if (Rin.isEmpty(es6)) return this.VARIABLE.codeEmpty

        try {
            const { code } = transform(es6, {
                presets: [preset],
                babelrc: false
            })

            return Rin.code('js', code)
        } catch (err) {
            return err.message
        }
    }

    get help() {
        const header = '**Empty code!**'
        const usage = '`rin babel <code>`'
        const example = [
            '`rin babel const a = 10; a = 1`,',
            `\`\`\`rin babel class MyClass {
    constructor(name) {
        console.log("I am a MyClass object .. ", name);
    }
}
            const myclass = new MyClass('1234')\`\`\``
        ].join('\n')
        const footer = `https://babeljs.io/`

        return `${header}\nUsage: ${usage}\nExample:\n${example}\nBabel: ${footer}`
    }
}
