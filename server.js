const fs = require('fs')
const path = require('path')
const express = require('express')
const formidable = require('formidable')
const bodyParser = require('body-parser')
const uuid = require('uuid')

const app = express()
const port = process.env.PORT || 3000

const uploadDir = path.join(__dirname, './uploads/')

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir)
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/static', express.static('uploads'))

app.post("/upload", async (req, res, next) => {
    
    try{
        let fileName 
        let form = new formidable.IncomingForm()

        form.parse(req, null)

        await form.on('fileBegin', function(name, file){
            let extArray = file.type.split('/')
            fileName = `${uuid()}.${extArray[1]}`
            file.path = `${path.join(__dirname+'/uploads/')}${fileName}`
        })
        res.json({fileName, url: `${req.get('host')}/static/${fileName}`})
    } catch (errors) {
        res.json({errors})
    }
})

app.listen(port, () => console.log(`Server is running at ${port}.`))