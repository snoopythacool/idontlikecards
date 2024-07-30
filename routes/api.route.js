const express = require('express')
const cookieParser = require('cookie-parser');
const axios = require('axios');
const router = express()

router.use(cookieParser())

const ROOTSITE = "https://idontlikecards-api.onrender.com"

router.get('/albums/:albumId', (req, res) => {
    let { albumId } = req.params
    axios.get(ROOTSITE + '/api/albums/' + albumId)
    .then(response => {
        // Send a response back to the client
        res.send(response.data);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error occurred');
    });
});

router.get('/searchall', (req, res) => {
    axios.get(ROOTSITE + '/api/albums')
    .then(response => {
        // Send a response back to the client
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).send('Error occurred');
    });
});

router.get('/search/:searchString', (req, res) => {
    let { searchString } = req.params
    axios.get(ROOTSITE + '/api/albums/search/' + searchString)
    .then(response => {
        // Send a response back to the client
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).send('Error occurred');
    });
});

router.get('/review/:albumId', (req, res) => {
    let { albumId } = req.params

    token = req.cookies.idlc || ""
    axios.get(ROOTSITE + '/api/reviews/' + (albumId), { headers: {"Authorization" : `Bearer ${token}`} })
    .then(response => {
        res.status(200).send(response.data)
    })
    .catch(error => {
        res.status(500).send(error.message);
    });
})

router.get('/reviews/:albumId', express.json(), (req, res) => {
    let { albumId } = req.params
    axios.get(ROOTSITE + '/api/reviews/fromAlbum/' + (albumId))
    .then(response => {
        // Send a response back to the client
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).send('Error occurred');
    });
});

router.post('/reviews/', express.json(), (req, res) => {
    let { albumId, review } = req.body

    token = req.cookies.idlc || ""
    axios.post(ROOTSITE + '/api/reviews/', { albumId, review }, { headers: {"Authorization" : `Bearer ${token}`} })
    .then(response => {
        // Send a response back to the client
        res.send(response.data);
    })
    .catch(error => {
        console.log(error)
        res.status(500).send('Error occurred');
    });
});

router.put('/reviews/', express.json(), (req, res) => {
    let { albumId, review } = req.body

    token = req.cookies.idlc || ""
    axios.put(ROOTSITE + '/api/reviews/', { albumId, review }, { headers: {"Authorization" : `Bearer ${token}`} })
    .then(response => {
        // Send a response back to the client
        res.send(response.data);
    })
    .catch(error => {
        console.log(error)
        res.status(500).send('Error occurred');
    });
});

router.delete('/reviews/:albumId', express.json(), (req, res) => {
    let { albumId } = req.params

    token = req.cookies.idlc || ""
    axios.delete(ROOTSITE + '/api/reviews/' + (albumId), { headers: {"Authorization" : `Bearer ${token}`} })
    .then(response => {
        // Send a response back to the client
        res.send(response.data);
    })
    .catch(error => {
        console.log(error)
        res.status(500).send('Error occurred');
    });
});

router.post('/login', express.json(), (req, res) => {
    axios.post(ROOTSITE + '/api/auth/login', req.body)
    .then(response => {
        let options = {
            maxAge: 1000 * 60 * 45, // would expire after 15 minutes
            httpOnly: true, // The cookie only accessible by the web server
        }
    
        // Set cookie
        responseData = response.data
        res.cookie('idlc', responseData.accessToken, options) // options is optional
        res.status(200).send('')
    })
    .catch(error => {
        res.status(500).send(error.message);
    });
});

router.post('/register', express.json(), (req, res) => {
    axios.post(ROOTSITE + '/api/auth/register', req.body)
    .then(response => {
        res.status(200).send('')
    })
    .catch(error => {
        res.status(500).send(error.message);
    });
});

router.get('/logout', express.json(), (req, res) => {
    try {
        res.clearCookie("idlc");
        res.status(200).send('')
    } catch (error) {
        res.status(401).send('')
    }
});

router.get('/auth', express.json(), (req, res) => {
    token = req.cookies.idlc || ""
    axios.get(ROOTSITE + '/api/auth/auth', { headers: {"Authorization" : `Bearer ${token}`} }).then(response => {
        res.status(200).send(response.data)
    })
    .catch(error => {
        res.status(500).send("Not signed in");
    });
});

router.get('/profile/:userId', (req, res) => {
    let { userId } = req.params

    axios.get(ROOTSITE + '/api/auth/profile/' + (userId)).then(response => {
        res.status(200).send(response.data)
    })
    .catch(error => {
        res.status(500).send('');
    });
})

module.exports = router;