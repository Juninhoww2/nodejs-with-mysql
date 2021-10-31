const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

console.log(pool)

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

app.post('/mangas/insertmanga', (req, res) => {
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `INSERT INTO mangas (title, pageqty) VALUES ('${title}' ,'${pageqty}')`

    pool.query(sql, function (err) {
        if(err) {
            console.log(err)
            return
        }

        res.redirect('/mangas')
    }) 
})

app.get('/mangas', (req, res) => {
    const sql = 'SELECT * FROM mangas'

    pool.query(sql, function (err, data) {
        if(err) {
            console.log(err)
        }

        const mangas = data

        console.log(mangas)

        res.render('mangas', { mangas })
    })
})

app.get('/mangas/:id', (req, res) => {
    const id = req.params.id
    
    const sql = `SELECT * FROM mangas WHERE id = ${id}`

    pool.query(sql, function (err, data) {
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

    pool.query(sql, function (err, data) {
        if(err) {
            console.log(err)
        }

        const manga = data[0]

        console.log(data[0])

        res.render('editmanga', { manga })
    })
})

app.post('/mangas/updatemanga', (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const sql = `UPDATE mangas SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`

    pool.query(sql, function(err) {
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

    pool.query(sql, function(err) {
        if(err) {
            console.log(err)
        }

        res.redirect('/mangas')
    })
})

app.listen(4000)
