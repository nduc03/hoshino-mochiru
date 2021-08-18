const express = require('express')
const path = require('path')
const fs = require('fs')

const app = express()
const port = process.env.PORT || 80

app.use(express.static('web/static'))

app.get('/', (req, res) => {
    fs.createReadStream(path.join(__dirname, 'html/index.html')).pipe(res)
})

app.get('/term_vi', (req, res) => {
    fs.createReadStream(path.join(__dirname, 'html/term_vi.html')).pipe(res)
})

app.get('/privacy_vi', (req, res) => {
    fs.createReadStream(path.join(__dirname, 'html/privacy_vi.html')).pipe(res)
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})