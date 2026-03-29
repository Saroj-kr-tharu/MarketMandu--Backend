const express = require('express')
const v1Routes = require('./routes/index')

const router = express.Router()

router.use('/v1',v1Routes);


module.exports= router;