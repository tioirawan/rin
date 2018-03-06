import fs from 'fs'
import webshot from 'webshot'
import rs from 'randomstring'
import Rin from '../core/rin'

export default class Snap {
    constructor() {
        this.INFO = {
            command: 'snap',
            description: 'screenshoot web',
            standarize: false
        }

        this.VARIABLE = {
            emptyURL: 'Empty url! usage `snap <url>',
            error: 'Whoops... something error'
        }

        this.IMAGEPATH = __dirname + '/../../images/'
    }

    async handle(command, { vendor, ctx }) {
        const url = encodeURI(command.join(' '))

        if (Rin.isEmpty(url)) return this.VARIABLE.emptyURL

        const filename = rs.generate() + '.png'
        const saveloc = `${this.IMAGEPATH}${filename}`

        try {
            await this.snap(url, saveloc)
        } catch (err) {
            return `${this.VARIABLE.error}: ${err.message ||
                JSON.stringify(err)}`
        }

        if (vendor == 'telegram') {
            ctx.replyWithChatAction('upload_photo')

            await ctx.replyWithPhoto(
                {
                    source: fs.createReadStream(saveloc)
                },
                {
                    reply_to_message_id: ctx.message.message_id
                }
            )
        } else if (vendor == 'discord') {
            ctx.channel.send(url, {
                file: {
                    attachment: fs.createReadStream(saveloc),
                    name: filename
                }
            })
        }

        fs.unlinkSync(saveloc)

        return
    }

    snap(url, saveloc) {
        return new Promise((resolve, reject) => {
            webshot(
                url,
                saveloc,
                {
                    windowSize: {
                        width: 1366,
                        height: 768
                    }
                },
                err => {
                    if (err) {
                        reject(err)

                        return
                    }

                    resolve(err)
                }
            )
        })
    }
}
