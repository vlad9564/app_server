const express = require('express');
const graphqlHTTP = require("express-graphql");
const schema = require("./graphql/Schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();


// Allow CORS
app.use(cors());

// Connect to DB
mongoose.connect("mongodb+srv://test:test@cluster0-bcmkp.mongodb.net/travel?retryWrites=true&w=majority");
mongoose.connection.once("open", () => {
    console.log("connected to db");

})

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true
}));


// app.listen(4000, () => {
//     console.log("now listening on port 4000");
// });

app.listen(process.env.PORT || 4000, () => {
    console.log("The application start on port 4000?");
})