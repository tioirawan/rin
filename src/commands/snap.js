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
            error: 'Whoops... something error',
            telegramImageErr:
                'Sorry, the image is too big or has invalid dimension'
        }

        this.IMAGEPATH = __dirname + '/../../images/'
    }

    async handle(command, { vendor, ctx }) {
        const url = encodeURI(command[0])

        if (Rin.isEmpty(url)) return this.VARIABLE.emptyURL

        const filename = rs.generate() + '.png'
        const saveloc = `${this.IMAGEPATH}${filename}`

        try {
            await this.snap(url, saveloc, command[1] == 'full')
        } catch (err) {
            return `${this.VARIABLE.error}: ${err.message ||
                JSON.stringify(err)}`
        }

        Rin.log.info('File size:', fs.statSync(saveloc).size)

        if (vendor == 'telegram') {
            ctx.replyWithChatAction('upload_photo')

            try {
                await ctx.replyWithPhoto(
                    {
                        source: fs.createReadStream(saveloc)
                    },
                    {
                        reply_to_message_id: ctx.message.message_id
                    }
                )
            } catch (err) {
                ctx.reply(this.VARIABLE.telegramImageErr)
            }
        } else if (vendor == 'discord') {
            await ctx.channel.send(url, {
                file: {
                    attachment: fs.createReadStream(saveloc),
                    name: filename
                }
            })
        }

        fs.unlinkSync(saveloc)

        return
    }

    snap(url, saveloc, full) {
        return new Promise((resolve, reject) => {
            const defaultOpt = {
                windowSize: {
                    width: 1366,
                    height: 768
                }
            }

            const opt = Object.assign(
                defaultOpt,
                full ? { shotSize: { height: 'all' } } : {}
            )

            webshot(url, saveloc, opt, err => {
                if (err) {
                    return reject(err)
                }

                resolve(err)
            })
        })
    }
}
