const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

const app = express()

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/mangas/insertmanga', function (req, res) {
    const title = req.body.title
    const pageqty = req.body.pageqty

    const query = `INSERT INTO mangas (title, pageqty) VALUES ('${title}', ${pageqty})`

    conn.query(query, function (err) {
        if(err) {
            console.log(err)
        }

        res.redirect('/')
    }) 
})

app.get('/mangas', function (req, res) {
    const query = "SELECT * FROM mangas"

    conn.query(query, function (err, data) {
        if(err) {
            console.log(err)
            return
        }

        const mangas = data

        console.log(mangas)

        res.render('mangas', { mangas })
    })
})

app.get('/mangas/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM mangas WHERE id = ${id}`

    conn.query(sql, function (err, data) {
        if(err) {
            console.log(err)
            return
        }

        const manga = data[0]

        res.render('manga', { manga })
    })
})

app.get('/mangas/edit/:id', (req, res) => {
    const id = req.params.id

    const sql = `SELECT * FROM mangas WHERE id = ${id}`

    conn.query(sql, function(err, data) {
        if(err) {
            console.log(err)
            return
        }

        const manga = data[0]

        res.render('editmanga', { manga })
    })
})

app.post('/mangas/updatemanga', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE mangas SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`

    conn.query(sql, function(err) {
        if(err) {
            console.log(err)
            return 
        }

        res.redirect('/mangas')
    })
})

app.post('/mangas/remove/:id', (req, res) => {

    const id = req.params.id
    const sql = `DELETE FROM mangas WHERE id = ${id}`

    conn.query(sql, function(err) {
        if(err) {
            console.log(err)
            return
        }

        res.redirect('/mangas')
    })
})

const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'nodemysql2'
})

conn.connect(function (err) {
    if(err) {
        console.log(err)
    }

    console.log('Conectou ao MySQL!')

    app.listen(4000)
})