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
            emptyURL:
                'Empty url! usage `snap <url> *<normal/mobile/full>`\n\nexample:\n`rin snap paypal.com`\n`rin snap paypal.com full`\n`rin snap paypal.com mobile`',  // Ignore LineLengthBear
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
            await this.snap(url, saveloc, command[1])
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

    snap(url, saveloc, mode) {
        return new Promise((resolve, reject) => {
            const options = {
                normal: {
                    windowSize: {
                        width: 1366,
                        height: 768
                    }
                },
                mobile: {
                    screenSize: {
                        width: 320,
                        height: 480
                    },
                    shotSize: {
                        width: 320,
                        height: 'all'
                    },
                    userAgent:
                        'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us)' +
                        ' AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
                },
                full: { shotSize: { height: 'all' } }
            }

            const opt = options[mode in options ? mode : 'normal']

            webshot(url, saveloc, opt, err => {
                if (err) {
                    return reject(err)
                }

                resolve(err)
            })
        })
    }
}
