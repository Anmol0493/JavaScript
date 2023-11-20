const express = require('express');
const router = express.Router();
require('dotenv').config();
const {ObjectId} = require('mongodb');
const client = require('./connection');


// Database & collection
const db = client.db(process.env.DB_NAME);
const collection = db.collection(process.env.C_NAME);


// GET method
router.get('/', async (_req, res) => {
    try {
        const data = await collection.find().toArray();
        res.json(data);
        console.log('Data fetched successfully');
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
        console.error('Error while fetching data', error);
    }
});

// GET by id method
router.get('/:id', async (req, res) => {
    try {
        const ID = new ObjectId(req.params.id);
        const data = await collection.find({_id: ID}).toArray();
        if (data.length === 0) {
            res.status(404).json({error: 'Data not found'});
            console.log('Data not found');
        } else {
            res.json(data);
            console.log('Data fetched successfully');
        }
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error '});
        console.error('Internal Server Error', error);
    }
});

// GET by name method
router.get('/name/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const data = await collection.find({name: name}).toArray();
        if (data.length === 0) {
            res.status(404).json({error: 'Data not found'});
            console.log('Data not found');
        } else {
            res.json(data);
            console.log('Data fetched successfully');
        }
    }
    catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
        console.error('Internal Server Error', error);
    }
});

// POST method
router.post('/', async (req, res) => {
    try {
        const newData = req.body;
        const result = await collection.insertMany(newData);
        res.json(result);
        console.log('Data posted successfully', result);
    } catch (error) {
        res.status(400).json({error: 'Error while inserting new data'});
        console.error('Error while inserting new data', error);
    }
});

// PUT method
router.put('/:id', async (req, res) => {
    try {
        const ID = new ObjectId(req.params.id);
        const newData = req.body;
        
        const data = await collection.findOne({_id: ID});
        
        if (!data) {
            res.json({Status: 'Data not found'});
            console.log('Data not found');
        } else {
            const result = await collection.updateOne({_id: ID}, {$set: newData});
            res.json({Status: `${ID} updated sucessfully`, result});
            console.log(`${ID} updated sucessfully`);
        }
    }
    catch (error) {
        res.status(400).json({error: 'Error while updating'});
        console.error('Error while updating', error);
    }
});

// DELETE method
router.delete('/:id', async (req, res) => {
    try {
        const ID = new ObjectId(req.params.id);

        const data = await collection.findOne({_id: ID});

        if (!data) {
            res.json({Status: 'Data not found'});
            console.log('Data not found');
        } else {
            const result = await collection.deleteOne({_id: ID});
            res.json({
                Status: `${ID} deleted successfully`,
                deleteCount: result.deletedCount
            });
            console.log(`${ID} deleted successfully`);
        }
    }
    catch (error) {
        console.error('Error while deleting', error);
        res.status(400).json({error: 'Error while deleting'});
    }
});


module.exports = router;