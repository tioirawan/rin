import http from 'http'

http
    .createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(
            `Hello! I am Rin, I am a simple multi-purpose bot, available in <a href="http://t.me/rin_a_bot">Telegram</a> and <a href="https://discordapp.com/oauth2/authorize?&client_id=412976772150329354&scope=bot&permissions=0">Discord</a>`
        )
    })
    .listen(process.env.PORT || 8080)
