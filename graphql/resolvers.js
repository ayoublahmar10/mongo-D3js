const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const assert = require('assert');

// Connection URL
const url = 'mongodb://root:example@mongodb:27017';
//const url = 'mongodb://root:example@127.0.0.1:27017';
//const url = 'mongodb://root:example@172.18.0.3:27017';

// Database Name

const dbName1 = 'dbgames';

// Create a new MongoClient
const client = new MongoClient(url, {useUnifiedTopology: true});

const findDocuments = function (db, col, query, callback) {
    // Get the documents collection
    const collection = db.collection(col);
    // Find some documents
    collection.find(query).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}


 function FindPublisher(db, col) {
    // Get the documents collection
    const collection = db.collection(col);
    
    collection.aggregate([  
        
        {$group: {_id:{Publisher:"$Publisher"} , count : { $sum:1} }} 
         ,{$project: { Publisher:"$_id.Publisher", count : 1 , _id:0 }},
          { $out : "publisher" } ]).toArray(function(er, resultat) { assert.equal(er, null); })

         
    }




        function FindPlatform(db, col) {
            // Get the documents collection
            const collection = db.collection(col);
            
            collection.aggregate([  
                
                {$group: {_id:{Platform:"$Platform"} , count : { $sum:1} }} 
                 ,{$project: { Platform:"$_id.Platform", count : 1 , _id:0 }},
                  { $out : "platform" } ]).toArray(function(er, resultat) { assert.equal(er, null); })
        
                 
            }


            function FindGenre(db, col) {
    // Get the documents collection
    const collection = db.collection(col);
    
    collection.aggregate([  
        
        {$group: {_id:{Genre:"$Genre"} , count : { $sum:1} }} 
         ,{$project: { Genre:"$_id.Genre", count : 1 , _id:0 }},
          { $out : "genre" } ]).toArray(function(er, resultat) { assert.equal(er, null); })

         
    }

   



const findOneDocument = function (db, col, query, callback) {
    // Get the documents collection
    const collection = db.collection(col);
    // Find some documents
    collection.findOne(query, function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

client.connect(function (err) {
    assert.equal(err, null);
    console.log("Connected correctly to the MongoDB server");

    // create new collection from aggregations

    const db1 = client.db(dbName1);
    FindGenre(db1, 'games');

    FindPlatform(db1, 'games');
    FindPublisher(db1, 'games');
});


// un résolveur simple pour la requête 'books' de type Query
// qui renvoie la variable 'books'
const resolvers = {
    Query: {
        
        games(root, args, context) {
            return new Promise((resolve, reject) => {
                const db1 = client.db(dbName1);
                findDocuments(db1, 'games', {}, resolve);
            }).then(result => {
                return result
            });
        },
        genre(root, args, context) {
            return new Promise((resolve, reject) => {
                const db1 = client.db(dbName1);
                findDocuments(db1, 'genre', {}, resolve);
            }).then(result => {
                return result
            });
        },
        platform(root, args, context) {
            return new Promise((resolve, reject) => {
                const db1 = client.db(dbName1);
                findDocuments(db1, 'platform', {}, resolve);
            }).then(result => {
                return result
            });
        },
        publisher(root, args, context) {
            return new Promise((resolve, reject) => {
                const db1 = client.db(dbName1);
                findDocuments(db1, 'publisher', {}, resolve);
            }).then(result => {
                return result
            });
        }


    }
};

// on exporte la définition de 'resolvers'
module.exports = resolvers;
