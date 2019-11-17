const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db, collection;

const url = "mongodb+srv://DanDan10:danoo1@star-wars-quotes-ldrjw.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "billTracker";

app.listen(3000, () => {
    MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        db = client.db(dbName);
        console.log("Connected to `" + dbName + "`!");
    });
});

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  //console.log(db)
  db.collection('bills').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {choice: result})
  })
})

app.post('/bills', (req, res) => {
  // let name = req.choice.name
  // let food = req.choice.food
  db.collection('bills').save({company: req.body.company, amount: req.body.amount, due: req.body.due}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// app.put('/bills', (req, res) => {
//   let company = req.body.company
//   db.collection('bills')
//   .findOneAndUpdate({company: req.body.company, amount: req.body.amount}, {
//     $set: {
//       thumbUp:req.body.thumbUp + 1
//     }
//   }, {
//     sort: {_id: -1},
//     upsert: true
//   }, (err, result) => {
//     if (err) return res.send(err)
//     res.send(result)
//   })
// })


app.delete('/bills', (req, res) => {
  db.collection('bills').findOneAndDelete({company: req.body.company, amount: req.body.amount, due: req.body.due}, (err, result) => {
    if (err) return res.send(500, err)
    res.send('Message deleted!')
  })
})
