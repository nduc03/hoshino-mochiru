const express = require('express')
const path = require('path')
const axios = require('axios')
const cookieParser = require('cookie-parser')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 80

app.use(express.static('web/static'))
app.use(
    express.urlencoded({
        extended: true
    })
)
app.use(cookieParser())
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/index.html'))
})

app.get('/term_vi', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/term_vi.html'))
})

app.get('/privacy_vi', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/privacy_vi.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/login.html'))
})

app.get('/admin', (req, res) => {
    //  TODO: Check authentication here.
    res.sendFile(path.join(__dirname, 'html/bot_admin.html'))
})

app.post('/admin', (req, res) => {
    const embedForm = req.body
    var embedOptions = {
        color: parseInt('0x' + embedForm.color.substring(1)),
        type: 'rich',
        title: embedForm.title,
        description: embedForm.description.replace('\r\n', '\n'),
    }
    console.log(embedOptions)
    if (!isNaN(embedForm.channel)) {
        axios.post(
            `https://discord.com/api/v9/channels/${embedForm.channel}/messages`,
            { embeds: [embedOptions] },
            { headers: { 'Authorization': `Bot ${process.env.TOKEN}` } },
        ).then(response => {
            console.log(response.status)
            res.render('success')
        }).catch(err => {
            console.log(err)
            res.render('fail')
        })
    }
    else {
        res.render('fail')
    }
})

app.listen(port, () => {
    console.log(`Website open at port: ${port}`)
})