import Rin from '../core/rin'
import axios from 'axios'
import isJson from 'is-json'
import fs from 'fs'
import { parse } from 'url'

export default class Get {
    constructor() {
        this.INFO = {
            command: 'get',
            description: 'perform simple GET http request',
            standarize: true
        }

        this.VARIABLE = {
            emptyURL: this.help,
            toBig: "It's too big, so I send it as a file",
            error: 'Whoops... something went wrong!'
        }
    }

    async handle(command, { vendor, ctx, client }) {
        const url = encodeURI(command[0])

        if (Rin.isEmpty(url)) return this.VARIABLE.emptyURL

        const params = command.slice(1).join(' ')

        let par

        try {
            par = params ? JSON.parse(params) : {}
        } catch (err) {
            return err.message
        }

        let response

        try {
            response = await axios.get(url, {
                responseType: 'text',
                params: par || {}
            })
        } catch (err) {
            response = err.message
        }

        response = response.data || response

        let result =
            typeof response == 'object'
                ? JSON.stringify(response, null, 2)
                : response

        if (result.length < Rin.maxAllowedLength) {
            return isJson(result) ? Rin.code('json', result) : result
        }

        const saveloc = Rin.tempPath(
            parse(url).host + (isJson(result) ? '.json' : '.txt')
        )

        fs.writeFileSync(saveloc, result)

        if (vendor == 'telegram') {
            try {
                await ctx.replyWithChatAction('upload_document')
            } catch (err) {
                Rin.sendLogError(client, err, Rin.getChatInfo(vendor, ctx))
            }

            try {
                await ctx.replyWithDocument(
                    {
                        source: saveloc
                    },
                    {
                        caption: this.VARIABLE.toBig,
                        reply_to_message_id: ctx.message.message_id
                    }
                )
            } catch (err) {
                Rin.sendLogError(client, err, Rin.getChatInfo(vendor, ctx))
                ctx.reply(this.VARIABLE.error)
            }
        } else if (vendor == 'discord') {
            try {
                await ctx.channel.send(this.VARIABLE.toBig, {
                    files: [saveloc]
                })
            } catch (err) {
                const error = err.message || JSON.stringify(err)

                await ctx.channel.send(error)

                Rin.log.error(error)
            }
        }
    }

    get help() {
        const header = 'Empty URL!\n'
        const usage =
            'usage: `get <url> *<params>` where params is javascript object (optional)\n\n'
        const params =
            "Example:\n`rin get example.com/random {token:'blablabla', code: 'nanana'}`"

        return header + usage + params
    }
}
