const express = require('express')
const cors = require('cors')
const pgp = require('pg-promise')()
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json()); 

const db = pgp(process.env.DB_CONN)


app.get('/', (req, res)=>{
    return res.send('Welcome to the SleepTrackr API')
})

app.post('/SignUp', (req, res)=>{
    db.none('INSERT INTO users(first_name, last_name, email) VALUES(${first}, ${last}, ${email})', {
        first: req.body.fname,
        last: req.body.lname,
        email: req.body.email
    })
    .then(result=>{
        return res.status(200).send('Success')
    })
    .catch(error=>{
        if(error.code === '23505' && error.detail.includes('Key (email)')){
            return res.status(500).send('Duplicate email')
        }
        return res.status(500).send('Something broke!')
    })
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("Listening on http://localhost:" + (process.env.PORT || 3000))
})