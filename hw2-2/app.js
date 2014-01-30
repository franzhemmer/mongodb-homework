var express = require('express')
  , app = express()
  , cons = require('consolidate')
  , MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    if(err) throw err;

    var data = db.collection('data');

    var cursor = data.find({});
    cursor.sort([[ 'State', 1 ], [ 'Temperature', -1 ]]);

    var currentState = '';
    cursor.each(function(err, doc) {
        if (err) throw err;
        
        if (doc == null) {
            return db.close();
        }
        
        if (currentState !== doc.State) {
            currentState = doc.State;
            doc['month_high'] = true;
            db.collection('data').update({ _id: doc._id }, { $set: { 'month_high': true }}, { upsert: false, multi: false }, function(err, updated) {
                if(err) throw err;
                console.dir("Successfully updated " + updated + " document!");
            });
            console.dir('Updated ' + doc._id);
        }
    });

    db.close();
});
