import Rin from '../core/rin'
import jawaskrip from 'jawaskrip'

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

        if (Rin.isEmpty(code)) return this.VARIABLE.codeEmpty

        try {
            const result = await jawaskrip.compile(code)

            return Rin.code('js', result)
        } catch (err) {
            return err.message || JSON.stringify(err)
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
