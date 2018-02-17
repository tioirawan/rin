import simpleMarkdown from 'simple-markdown'
import logger from 'winston'

import * as Commands from '../commands'

const env = process.env.NODE_ENV || 'development'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
    colorize: true
})
logger.level = env === 'development' ? 'debug' : 'info'

export default class Rin {
    constructor() {
        this.commands = Object.keys(Commands)
            .map(cmd => new Commands[cmd]())
            .filter(this.checkRequired)

        this.commandLists = this.commands.map(cmd => ({
            command: cmd.INFO.command,
            description: cmd.INFO.description
        }))
    }

    checkRequired(cmd) {
        const required = cmd.INFO.required

        const check = required => {
            if (!required) return true
            if (!required.length) return true

            const completed = required.filter(req => {
                if (typeof req.toBe == 'function') {
                    return !req.toBe(req.value)
                }

                return !req.value
            })

            if (completed.length) return false

            return true
        }

        const checkResult = check(required)

        if (!checkResult) {
            Rin.log.warn(
                `${
                    cmd.INFO.command
                } command require something, and not passed, skip`
            )

            return false
        }

        return true
    }

    get defaultReply() {
        return Rin.defaultReply(this.commandLists)
    }

    async handle(message) {
        const argument =
            typeof message == 'object' ? message : message.split(' ')

        const usrCmd = argument[0]

        const command = this.commands.find(
            cmd => usrCmd == cmd.INFO.command.toLowerCase()
        )

        if (command) {
            return await command.handle(argument.slice(1))
        }

        return await this.defaultReply
    }

    static extractText(node) {
        let text = node.content
        if (node.content instanceof Array) {
            text = node.content.map(Rin.extractText).join('')
        }
        return text
    }

    static mdToHtml(text) {
        const mdParse = simpleMarkdown.defaultBlockParse
        const newlineNode = { content: '\n', type: 'text' }

        const tagMap = new Proxy(
            {
                u: 'b',
                strong: 'b',
                em: 'em',
                inlineCode: 'code',
                codeBlock: 'pre'
            },
            {
                get(target, prop) {
                    const tags = {
                        start: '',
                        end: ''
                    }

                    if (prop in target) {
                        tags.start = `<${target[prop]}>`
                        tags.end = `</${target[prop]}>`
                    }

                    return tags
                }
            }
        )

        const processedText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\s*:.*?:\s*/g, ' ')

        return mdParse(processedText)
            .map(rootNode => {
                let content = rootNode.content

                if (rootNode.type !== 'paragraph') {
                    content = rootNode
                }

                return content
            })
            .reduce(
                (flattened, nodes) =>
                    flattened.concat([newlineNode, newlineNode], nodes),
                []
            )
            .slice(2)
            .reduce((html, node) => {
                const tags = tagMap[node.type]

                return html + `${tags.start}${Rin.extractText(node)}${tags.end}`
            }, '')
    }

    standarize(text) {
        return Rin.standarize(text)
    }

    notEmpty(text) {
        return Rin.notEmpty(text)
    }

    static defaultReply(commandLists) {
        const cmdListString = commandLists
            .map(cmd => `\`${cmd.command}\` - ${cmd.description}`)
            .join('\n')

        return `Hello! I am Rin an open source multi-purpose bot https://github.com/indmind/rin feel free to contribute!\n you can use the following command:\n${cmdListString}`
    }

    static get log() {
        return logger
    }

    static standarize(text) {
        return text.replace(/\s\s+/g, ' ').toLowerCase()
    }

    static notEmpty(text) {
        return (
            typeof text != 'undefined' &&
            typeof text.valueOf() == 'string' &&
            text.length > 0
        )
    }
}
