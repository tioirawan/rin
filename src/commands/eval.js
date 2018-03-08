import Rin from '../core/rin'
import axios from 'axios'

export default class Eval {
    constructor() {
        this.INFO = {
            command: 'eval',
            description: 'run programming code',
            standarize: false
        }

        this.REXTERURL = 'http://rextester.com/rundotnet/api'

        this.LANGUAGE = {
            'C#': 1,
            'VB.NET': 2,
            'F#': 3,
            Java: 4,
            Python: 5,
            C: 6,
            'C++': 7,
            Php: 8,
            Pascal: 9,
            ObjectiveC: 10,
            Haskell: 11,
            Ruby: 12,
            Perl: 13,
            Lua: 14,
            Nasm: 15,
            Javascript: 23,
            Lisp: 18,
            Prolog: 19,
            Go: 20,
            Scala: 21,
            Scheme: 22,
            js: 23,
            Python3: 24,
            Octave: 25,
            D: 30,
            R: 31,
            Tcl: 32,
            MySQL: 33,
            PostgreSQL: 34,
            Oracle: 35,
            Swift: 37,
            Bash: 38,
            Ada: 39,
            Erlang: 40,
            Elixir: 41,
            Ocaml: 42,
            Kotlin: 43,
            Brainfuck: 44,
            Fortran: 45
        }

        this.LANGS = Object.keys(this.LANGUAGE)

        this.VARIABLE = {
            codeEmpty: this.help,
            unknownLang: 'Unknown language'
        }
    }

    async handle(command) {
        const language = command[0]
        const code = command.slice(1).join(' ')

        if (Rin.isEmpty(code)) return this.VARIABLE.codeEmpty

        const langs = this.LANGS

        if (
            !langs
                .map(c => c.toLocaleLowerCase())
                .includes(language.toLowerCase())
        ) {
            return `${this.VARIABLE.unknownLang} \`${language}\``
        }

        const accAbleLang = {}

        for (let key of langs) {
            accAbleLang[key.toLocaleLowerCase()] = this.LANGUAGE[key]
        }

        let response

        try {
            response = await axios.post(this.REXTERURL, {
                LanguageChoice: accAbleLang[language].toString(),
                Program: code
            })
        } catch (err) {
            response = err.message
        }

        const result = response.data || response

        return this.compose(result)
    }

    compose(data) {
        let result = ''

        if (data.Warnings) {
            result += `Warnings: ${data.Warnings}`
        }

        if (data.Errors) {
            result += `Error: ${data.Errors}`
        }

        if (data.Result) {
            result += Rin.code('', data.Result.toString().trim())
        }

        result += `\n**Stats: ${data.Stats || '-'}**`

        return result
    }

    get help() {
        const header = 'Usage: `eval <language> <code> *<stdin>`'
        const example =
            'Example: `rin eval javascript console.log("Hello World!")`'
        const availableLang = this.LANGS.map(l => `\`${l}\``).join('\n')

        return `${header}\n${example}\n\nAvailable Language:\n${availableLang}`
    }
}
