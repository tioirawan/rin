import Udict from '../command/udict'
import Calc from '../command/calc'
import Wiki from '../command/wiki'

import simpleMarkdown from 'simple-markdown'

export default class Rin {
    static get command() {
        return {
            udict: new Udict(),
            calc: new Calc(),
            wiki: new Wiki()
        }
    }

    static get cmdLists() {
        return Object.keys(Rin.command)
    }

    static get defaultReply() {
        const cmdListString = Rin.cmdLists.map(cmd => `\`${cmd}\``).join('\n')

        return `Hello! I am Rin an open source multi-purpose bot https://github.com/indmind/rin feel free to contribute!\n you can use the following command:\n${cmdListString}`
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
                    let tags = {
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

        let processedText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\s*:.*?:\s*/g, ' ')

        let html = mdParse(processedText)
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
                let tags = tagMap[node.type]

                return html + `${tags.start}${Rin.extractText(node)}${tags.end}`
            }, '')

        return html
    }
}
