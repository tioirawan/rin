import Rin from '../core/rin'
import figlet from 'figlet'

export default class Figlet {
    constructor() {
        this.INFO = {
            command: 'figlet',
            description: 'create a sort ASCII figlet banner (_experimental_)',
            standarize: false
        }

        this.VARIABLE = {
            textEmpty: 'usage `figlet <some text>` ex `figlet Hello World!`',
            discordOnly:
                'sorry, this command just available on discord\n\nhttps://discordbots.org/bot/412976772150329354'
        }
    }

    async handle(command, { vendor }) {
        if (vendor != 'discord') return this.VARIABLE.discordOnly

        const text = command.join(' ')

        if (Rin.isEmpty(text)) return this.VARIABLE.textEmpty

        try {
            const ascii = figlet.textSync(text)

            return Rin.code('', ascii)
        } catch (err) {
            return err.message || JSON.stringify(err)
        }
    }
}
