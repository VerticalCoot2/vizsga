const express = require('express');
const app = express();
const router = express.Router();
const port = 3000;
const ip = '127.0.0.1';
const path = require('path');
const fs = require('fs');
const { CallTracker } = require('assert');
const multer = require("multer");
const { request } = require('http');
const upload = multer({dest : 'uploads/'})
app.use(express.json());
app.use(express.static('public'));
const db = require(path.join(__dirname + '/sql/db-queries.js'));



router.get('/fooldal', (request, response) =>
{
    response.sendFile(path.join(__dirname + '/public/html/index.html'));
});

router.get('/', (request, response) =>
{
    response.sendFile(path.join(__dirname + '/public/html/index.html'));
});

async function readfileAsync(filepath)
{
    try
    {
        return await fs.promises.readFile(filepath, "utf-8");
    }
    catch(err)
    {
        console.log(err);
    }
}




app.get('/api/selectAll', (request, response) =>
    {
    db.selectAll()
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            console.error('Error:', err);
        });
});

app.get('/api/selectAllAdmin', (request, response) =>
    {
    db.selectAllAdmin()
        .then((data) => {
            response.json(data);
        })
        .catch((err) => {
            console.error('Error:', err);
        });
});

app.post('/api/insertEtel' , upload.single('file'), async (req, res) =>
{
    let tomb_insert = [];
    tomb_insert.push(req.body.Name);
    tomb_insert.push(req.body.Calories);
    tomb_insert.push(req.body.Fat_g_);
    tomb_insert.push(req.body.Protein_g_);
    tomb_insert.push(req.body.Carbohydrate_g_);
    tomb_insert.push(req.body.Sugars_g_);
    tomb_insert.push(req.body.Fiber_g_);
    tomb_insert.push(req.body._200_Calorie_Weight_g_);
    try
    {
        res.send(await db.insert(tomb_insert));
    }
    catch(err)
    {
        console.log(err);
    }
})

app.get('/api/selectID' , async (req, res) =>
    {
    try
    {
        res.send(await db.selectID([req.query.id]));
    }
    catch(err)
    {
        console.log(err);
    }
})

const basicAuth = require('express-basic-auth');

app.use('/admin', basicAuth({
    users: { 'admin': 'password123' },
    challenge: true
}));

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname + '/admin/admin.html'));
});

app.post('/api/adminDel/:azon',async (req,res) => {
    let azon=req.params.azon
    try
    {
        res.send(await db.adminDelete(azon));
    }
    catch(err)
    {
        console.log(err);
    }
})


app.post('/api/insertAdmin' , upload.single('file'), async (req, res) =>
        {
    
            let tomb_insert = [];
            tomb_insert.push(req.body.Name);
            tomb_insert.push(req.body.Calories);
            tomb_insert.push(req.body.Fat_g_);
            tomb_insert.push(req.body.Protein_g_);
            tomb_insert.push(req.body.Carbohydrate_g_);
            tomb_insert.push(req.body.Sugars_g_);
            tomb_insert.push(req.body.Fiber_g_);
            tomb_insert.push(req.body._200_Calorie_Weight_g_);
            console.log(tomb_insert)
            try
            {
                res.send(await db.insertAdmin(tomb_insert));
            }
            catch(err)
            {
                console.log(err);
            }
        })


app.get('/etrendkeszito', (request, response) =>
{
    response.sendFile(path.join(__dirname + '/public/html/etrendkeszito.html'));
});

app.get('/kaloriaszamlalo', (request,response) => {
    response.sendFile(path.join(__dirname+'/public/html/kaloriaszamlalo.html'))
})

app.get('/api/selectFogyas', async (req, res) =>
{
    try
    {
        res.send(await db.selectFogyas());
    }
    catch(err)
    {
        console.log(err);
    }
})

app.get('/api/selectTomegMegtart', async (req, res) =>
{
    try
    {
        res.send(await db.selectTomegMegtart());
    }
    catch(err)
    {
        console.log(err);
    }
})

app.get('/api/selectTomegNovel', async (req, res) =>
{
    try
    {
        res.send(await db.selectTomegNovel());
    }
    catch(err)
    {
        console.log(err);
    }
})

app.use('/', router);

app.listen(port, () => 
{
    console.log('Server running: http://localhost:3000');
});
