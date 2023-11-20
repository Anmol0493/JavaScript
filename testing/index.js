const express = require('express');
const app = express();

app.use(express.json());

const mongoose = require('mongoose');

const connectToDB = mongoose
    .connect('mongodb://0.0.0.0:27017/testing')
    .then(() => {
        console.log("Connected to Database");
    })
    .catch((error) => {
        console.error(error);
        process.exit();
    });

connectToDB;

// model
const candidateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    short_description: {
        type: String,
        required: true,
        default: null
    },
    activity: [{
        date: {
            type: String,
            default: null
        },
        content: {
            type: String,
            default: null
        }
    }],
    experience: [{
        company: {
            type: String,
            default: null
        },
        role: [{
            role: {
                type: String,
                default: null
            },
            location: {
                type: String,
                default: null
            },
            duration: {
                type: String,
                default: null
            }
        }],
        skills: [{
            type: String,
            default: null
        }]
    }],
    education: [{
        institute: {
            type: String,
            default: null
        },
        course: {
            type: String,
            default: null
        },
        dates: {
            type: String,
            default: null
        },
        skills: [{
            type: String,
            default: null
        }]
    }],
    license: [{
        name: {
            type: String,
            default: null
        },
        institute: {
            type: String,
            default: null
        },
        date: {
            type: String,
            default: null
        }
    }],
    skills: [{
        type: String,
        required: true,
        default: null
    }],
    recommendation: [{
        given: [{
            name: {
                type: String,
                default: null
            },
            summary: {
                type: String,
                default: null
            }
        }],
        received: [{
            name: {
                type: String,
                default: null
            },
            summary: {
                type: String,
                default: null
            }
        }]
    }],
    honors_awards: [{
        name: {
            type: String,
            default: null
        },
        issuer: {
            type: String,
            default: null
        }
    }],
    test: [{
        name: {
            type: String,
            default: null
        },
        score: {
            type: Number
        },
        date: {
            type: String,
            default: null
        },
        issuer: {
            type: String,
            default: null
        }
    }],
    languages: [{
        type: String,
        default: null
    }],
    interest: [{
        companies: [{
            type: String,
            default: null
        }],
        groups: [{
            type: String,
            default: null
        }],
        schools: [{
            type: String,
            default: null
        }]
    }]
});

const Candidate = mongoose.model('Candidates', candidateSchema, 'Candidates');

// route
app.post('/addCandidate', async function (req, res) {
    try {

        const candidate = new Candidate(req.body);

        await candidate.save();
        res.status(200).json({ message: 'Candidate Saved Successfully' })

    } catch (error) {
        res.status(500).json({ error: 'Failed to add candidate', error })
    }
});

const axios = require('axios');
app.get('/addCandidateByBase64', async function (req, res) {
    try {
        const encodedData = req.query.data;
        const decodedData = Buffer.from(encodedData, 'base64').toString('utf-8');

        const candidate = JSON.parse(decodedData);

        await axios.post('http://localhost:8080/addCandidate', candidate);
        res.status(200).json({ message: 'Candidate Saved Successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Failed to decode and send data' })
    }
});

app.get('/candidate', async function (req, res) {
    try {
        const candidates = await Candidate.find({})
        res.status(200).json(candidates)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get candidates' })
    }
});


// testing server
app.get('/', (_req, res) => { res.send('Hello World'); });


// Server Port
app.listen(8080, () => { console.log(`Server listening at http://localhost:8080`); });