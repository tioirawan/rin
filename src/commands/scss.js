import sass from 'node-sass'
import beautify from 'cssbeautify'

import { isEmpty, code as markCode } from '../core/rin'

export default class Scss {
    constructor() {
        this.INFO = {
            command: 'scss',
            description: 'compile scss to css',
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
            const response = sass.renderSync({
                data: code
            })

            const result = beautify(response.css.toString(), {
                indent: '  ',
                autosemicolon: true
            })

            return markCode('css', result)
        } catch (err) {
            return err.message
        }
    }

    get help() {
        const header = '**Empty code!**'
        const usage = '`rin scss <code>`'
        const example = [
            `\`\`\`rin scss $font-stack:    Helvetica, sans-serif;
$primary-color: #333;
body {
    font: 100% $font-stack;
    color: $primary-color;
}\`\`\``
        ].join('\n')
        const footer = `https://sass-lang.com/`

        return `${header}\nUsage: ${usage}\nExample:\n${example}\nSASS/SCSS: ${footer}`
    }
}
