const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'eteldb'
});

function selectAll() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM `etelek`;', (err, result, fields) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function selectID(tomb_selectID) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM etelek WHERE id = ?;',tomb_selectID, (err, result, fields) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function selectFogyas() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM etelek WHERE Calories < 350;', (err, result, fields) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function selectTomegMegtart() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM etelek WHERE Calories BETWEEN 350 AND 550;', (err, result, fields) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function selectTomegNovel() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM etelek WHERE Calories > 550;', (err, result, fields) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

function insert(tomb_insert)
{
    return new Promise((resolve, reject) =>
    {
        pool.query('INSERT INTO etelek(Name, Calories, Fat_g_, Protein_g_ ,Carbohydrate_g_, Sugars_g_, Fiber_g_, _200_Calorie_Weight_g_ ) VALUES (?)', [tomb_insert], (err, result) =>
        {
            if(err) return reject(err);
            resolve(result);
        });
    });
}

function insertAdmin(tomb_insert)
{
    return new Promise((resolve, reject) =>
    {
        pool.query('INSERT INTO `adminInsert`(Name, Calories, Fat_g_, Protein_g_ ,Carbohydrate_g_, Sugars_g_, Fiber_g_, _200_Calorie_Weight_g_ ) VALUES (?)', [tomb_insert], (err, result) =>
        {
            if(err) return reject(err);
            resolve(result);
        });
    });
}

function adminDelete(azon)
{
    return new Promise((resolve, reject) =>
        {
            pool.query('DELETE FROM `adminInsert` WHERE id=?', [azon], (err, result) =>
            {
                if(err) return reject(err);
                resolve(result);
            });
        });
}

function selectAllAdmin() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM `adminInsert`;', (err, result, fields) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}

module.exports = {
    selectAll,
    insert,
    selectID,
    selectFogyas,
    selectTomegMegtart,
    selectTomegNovel,
    insertAdmin,
    selectAllAdmin,
    adminDelete,
};
//?Több function esetén vesszővel felsorolni a meghívható metódusokat. (pl.: selectAll, insertData)
