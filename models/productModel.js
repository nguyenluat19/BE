const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    priceGoc: {
        type: Number,
        required: true,
        min: 0,
    },
    quantity: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: false,
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        required: false,
        min: 0,
        max: 5
    },
    detailImage: {
        type: String,
    }

}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema)