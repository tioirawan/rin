import jawaskrip from 'jawaskrip'

import { isEmpty, code as markCode } from '../core/rin'

export default class Jawaskrip {
    constructor() {
        this.INFO = {
            command: 'jawaskrip',
            description: 'compile jawaskrip to javascript',
            standarize: false
        }

        this.VARIABLE = {
            codeEmpty: this.help
        }
    }

    async handle(command) {
        const code = command.join(' ')

        if (isEmpty(code)) return this.VARIABLE.codeEmpty

        try {
            const result = await jawaskrip.compile(code)

            return markCode('js', result)
        } catch (err) {
            return err.message
        }
    }

    get help() {
        const header = '**Empty code!**'
        const usage = '`rin jawaskrip <code>`'
        const example = [
            '`rin jawaskrip tulis("Hello World")`,',
            '`rin jawaskrip jika(benar) tulis("salah"))`'
        ].join('\n')
        const footer = `https://github.com/indmind/jawaskrip`

        return `${header}\nUsage: ${usage}\nExample:\n${example}\nJawaskrip: ${footer}`
    }
}
