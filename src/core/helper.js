import simpleMarkdown from 'simple-markdown'
import logger from 'winston'
import fs from 'fs'
import showdown from 'showdown'
import path from 'path'
import rata from 'rata'

import * as Commands from '../commands'

const env = process.env.NODE_ENV || 'development'

const maxAllowedLength = 2000
const tempPath = __dirname + '/../../temp/'

logger.remove(logger.transports.Console)
logger.add(logger.transports.Console, {
    colorize: true
})
logger.level = env === 'development' ? 'debug' : 'info'

export const log = logger

export function getMaxAllowedLength() {
    return maxAllowedLength
}

export function getAvailableCommand() {
    return Object.keys(Commands)
}

export function extractText(node) {
    let text = node.content

    if (node.content instanceof Array) {
        text = node.content.map(extractText).join('')
    }

    return text
}

export function mdToHtml(text) {
    const noPs = {
        type: 'output',
        filter: text => text.replace(/<\/?p[^>]*>/gi, '')
    }

    const converter = new showdown.Converter({
        extensions: [noPs],
        simplifiedAutoLink: true
    })

    return converter.makeHtml(text)
}

export function removeMarkdown(markdown) {
    const mdParse = simpleMarkdown.defaultBlockParse
    const newlineNode = {
        content: '\n',
        type: 'text'
    }

    return mdParse(markdown)
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
        .reduce((acc, node) => {
            return acc + `${extractText(node) || ''}`
        }, '')
}

export function defaultReply(commandLists, tidy = false) {
    let cmdListString

    if (tidy) {
        const data = commandLists.map(cmd => [cmd.command, cmd.description])
        cmdListString = `\`\`\`${rata(data, ' - ')}\`\`\``
    } else {
        cmdListString = commandLists
            .map(cmd => `\`${cmd.command}\` - ${cmd.description}`)
            .join('\n')
    }

    const header = '**Hello! I am Rin, you can use the following command:**'
    const footer = 'https://github.com/indmind/rin feel free to contribute!'

    return `${header}\n\n${cmdListString}\n\n${footer}`
}

export function getTempPath(sub = '') {
    return path.join(tempPath, sub)
}

export function standarize(text) {
    return text
        .replace(/\s\s+/g, ' ')
        .trim()
        .toLowerCase()
}

export function notEmpty(arg) {
    return !isEmpty(arg)
}

export function isEmpty(arg) {
    if (typeof arg === 'undefined') return true

    switch (arg.constructor) {
        case String:
            return !arg || arg.length === 0
        case Number:
            return number === 0 // is zero
        case Array:
            return arg.length <= 0
        case Object:
            return Object.keys(arg).length <= 0
        case Map:
            return arg.size <= 0
        default:
            return true
    }
}

export function code(type, text) {
    return '```' + type + '\n' + text + '\n```'
}

export function XOR(a, b) {
    return a ? !b : b
}

export function getFileSize(filePath) {
    const stats = fs.statSync(filePath)
    const size = stats.size
    const i = Math.floor(Math.log(size) / Math.log(1024))

    return (
        (size / Math.pow(1024, i)).toFixed(2) * 1 +
        ' ' +
        ['B', 'KB', 'MB', 'GB', 'TB'][i]
    )
}

// telegram only
export function sendLogError(app, err, chatInfo = '') {
    log.error(err)

    if (isEmpty(process.env.TELE_ERR_CHAT_ID)) return

    app.telegram.sendMessage(
        process.env.TELE_ERR_CHAT_ID,
        `Error:\n${chatInfo}\n\n${err.message || JSON.stringify(err)}`
    )
}

export function getChatInfo(vendor, ctx) {
    if (vendor == 'telegram') {
        const userName =
            ctx.message.from.first_name + ctx.message.from.last_name
        const message = ctx.message.text

        return `[TELEGRAM]${userName}(${ctx.message.from.id}): ${standarize(
            message
        )}`
    } else if (vendor == 'discord') {
        const message = ctx.content
        const username = ctx.author.username

        return `[DISCORD]${username}(${ctx.author.id}): ${standarize(message)}`
    }
}
