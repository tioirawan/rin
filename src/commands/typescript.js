import Rin from '../core/rin'
import tsc from 'typescript-compiler'

export default class Typescript {
    constructor() {
        this.INFO = {
            command: 'typescript',
            description: 'compile typescript to javascript',
            standarize: false
        }

        this.VARIABLE = {
            codeEmpty: this.help,
            unknownEror: 'sorry, an unknown error occurred'
        }
    }

    async handle(command) {
        const ts = command.join(' ')

        if (Rin.isEmpty(ts)) return this.VARIABLE.codeEmpty

        try {
            const result = tsc.compileString(ts, '--target ES6', null, e => {
                if (e) throw e.formattedMessage
            })

            if (Rin.isEmpty(result)) return this.VARIABLE.unknownEror

            return Rin.code('js', result)
        } catch (err) {
            return err.message || err
        }
    }

    get help() {
        const header = '**Empty code!**'
        const usage = '`rin typescript <code>`'
        const example = [
            '`rin typescript const a : string = "Hello World"`'
        ].join('\n')
        const footer = `https://www.typescriptlang.org/`

        return `${header}\nUsage: ${usage}\nExample:\n${example}\nTypescript: ${footer}`
    }
}
