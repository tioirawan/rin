import Rin from '../core/rin'
import sass from 'node-sass'
import beautify from 'cssbeautify'

export default class Translate {
    constructor() {
        this.INFO = {
            command: 'scss',
            description: 'compile scss to css'
        }
        this.VARIABLE = {
            codeEmpty: 'empty code!'
        }
    }

    async handle(command) {
        const code = command.join(' ')

        if (Rin.isEmpty(code)) return this.VARIABLE.codeEmpty

        try {
            const response = sass.renderSync({
                data: code
            })

            const result = beautify(response.css.toString(), {
                indent: '  ',
                autosemicolon: true
            })

            return result
        } catch (err) {
            return err.message
        }
    }
}
