const mongoose = require("mongoose");


const newSchema = new mongoose.Schema({
    name: String,
    slugNew: {
        type: String,
        unique: true
    },
    date: { type: Date, default: Date.now },
    image: String,
    description: String
})

const New = mongoose.model("New", newSchema);

module.exports = New;