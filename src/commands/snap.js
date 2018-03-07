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

        this.MODES = {
            mobile: {
                screenSize: {
                    width: 540,
                    height: 960
                },
                shotSize: {
                    width: 540
                },
                userAgent:
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) ' +
                    'AppleWebKit/534.46 (KHTML, like Gecko) Chrome/63.0.3239.111 Safari/537.36'
            },
            tablet: {
                screenSize: {
                    width: 1280,
                    height: 800
                },
                shotSize: {
                    width: 1280
                },
                userAgent:
                    'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) ' +
                    'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Safari/537.36'
            },
            full: { shotSize: { height: 'all' } }
        }

        this.VARIABLE = {
            emptyURL: this.help,
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
            await this.snap(url, saveloc, command.slice(1))
        } catch (err) {
            return `${this.VARIABLE.error}: ${err.message ||
                JSON.stringify(err)}`
        }

        const fileSize = Rin.getFileSize(saveloc)

        Rin.log.info('File size:', fileSize)

        if (vendor == 'telegram') {
            ctx.replyWithChatAction('upload_photo')

            try {
                await ctx.replyWithPhoto(
                    {
                        source: fs.createReadStream(saveloc)
                    },
                    {
                        caption: `Image Size: ${fileSize}`,
                        reply_to_message_id: ctx.message.message_id
                    }
                )
            } catch (err) {
                ctx.reply(
                    `${
                        this.VARIABLE.telegramImageErr
                    }\n\nImage Size: ${fileSize}`
                )
            }
        } else if (vendor == 'discord') {
            try {
                await ctx.channel.send(`Image Size: ${fileSize}`, {
                    file: {
                        attachment: fs.createReadStream(saveloc),
                        name: filename
                    }
                })
            } catch (err) {
                const error = err.message || JSON.stringify(err)

                await ctx.channel.send(error)

                Rin.log.error(error)
            }
        }

        fs.unlinkSync(saveloc)

        return
    }

    snap(url, saveloc, mode) {
        return new Promise((resolve, reject) => {
            const opt = {
                screenSize: {
                    width: 1366,
                    height: 768
                },
                userAgent:
                    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Chrome/63.0.3239.111 Safari/537.36'
            }

            for (let m of mode) {
                Object.assign(opt, this.MODES[m in this.MODES ? m : {}])
            }

            webshot(url, saveloc, opt, err => {
                if (err) {
                    return reject(err)
                }

                resolve(err)
            })
        })
    }

    get help() {
        const header = 'Empty url! usage `snap <url> *<mode>`'

        const example = [
            '`rin snap paypal.com`',
            '`rin snap paypal.com full`',
            '`rin snap paypal.com mobile full`'
        ].join('\n')

        const availableMode = Object.keys(this.MODES)
            .map(m => `\`${m}\``)
            .join('\n')

        return `${header}\n\nExample:\n${example}\n\nAvailable Modes:\n${availableMode}`
    }
}
