import Rin from '../core/rin'
import translate from 'google-translate-api'

export default class Translate {
    constructor() {
        this.INFO = {
            command: 'translate',
            description: 'translate a text',
            standarize: false
        }

        this.VARIABLE = {
            wrongFormat:
                'wrong format! usage `translate [from] [to] text` ex: `translate id en selamat pagi!`',
            emptyText: 'empty text'
        }
    }

    async handle(command) {
        if (command.length < 3) return this.VARIABLE.wrongFormat

        const text = command.slice(2).join(' ')

        if (Rin.isEmpty(text)) return this.VARIABLE.emptyText

        return await this.translate(text, command[0], command[1])
    }

    async translate(text, from = 'auto', to = 'en') {
        try {
            const result = await translate(text, { from, to })

            return this.compose(result)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }
    }

    compose(data) {
        let result = ''

        const language = data.from.language
        const text = data.from.text

        if (text.autoCorrected) {
            result += `Did you mean: ${text.value}?`
        }

        if (language.didYouMean) {
            if (text.autoCorrected) {
                result += `from ${language.iso}`
            } else {
                result += `Did you mean from ${language.iso}?`
            }
            result += '\n\n'
        }

        if (text.autoCorrected && !language.didYouMean) {
            result + '\n\n'
        }

        result += `${data.text}`

        return result
    }
}
