import http from 'http'
import fs from 'fs'

const index = __dirname + '/../../view/index.html'

const indexHtml = fs.readFileSync(index, 'utf8').toString()

http
    .createServer((req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        })
        res.write(indexHtml)
        res.end()
    })
    .listen(process.env.PORT || 8080)
