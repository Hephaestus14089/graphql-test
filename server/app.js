const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();
const dbUrl = 'mongodb+srv://bhargav:iWjp2xeF3TB9pfV@cluster0.ffpdokd.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(dbUrl);
mongoose.connection.once('open', () => {
  console.log("connection to database establised.");
});

app.use('/graphql', graphqlHTTP({
   schema , // schema: schema
   graphiql: true
}));

app.listen(4000, () => {
    console.log("listening on port 4000...");
});
