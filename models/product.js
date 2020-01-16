const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    done: Boolean
});

module.exports = mongoose.model("product", productSchema);