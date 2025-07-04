const {Schema, model} = require('mongoose');

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    
})

const serviceModel = model('service', serviceSchema);

module.exports = serviceModel;