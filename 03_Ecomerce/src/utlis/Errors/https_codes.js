const ClientErrorsCodes = Object.freeze({
    BAD_REQUEST:400,
    UNAUTHORISED: 401,
    NOT_FOUND:404
});


const ServerErrosCodes = Object.freeze({
    INTERNAL_SERVER_ERROR:500,
    NOT_IMPLEMENTED:501,

})


const SucessCode= Object.freeze({
    CREATED: 201,
    OK:200
})

module.exports = {
    SucessCode,
    ServerErrosCodes,
    ClientErrorsCodes
}