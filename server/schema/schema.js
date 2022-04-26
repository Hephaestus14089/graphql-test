const graphql = require('graphql');
const _ = require('lodash');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList

} = graphql;


// dummy data
let books = [
    { 
        name: "Name of the Wind",
        genre: "Fantasy",
        id: "1",
        authorId: "1"
    },
    { 
        name: "The Final Empire",
        genre: "Fantasy",
        id: "2",
        authorId: "2"
    },
    { 
        name: "The Long Earth",
        genre: "Sci-Fi",
        id: "3",
        authorId: "3"
    },
    { 
        name: "The Hero of Ages",
        genre: "Fantasy",
        id: "4",
        authorId: "2"
    },
    { 
        name: "The Colour of Magic",
        genre: "Fantasy",
        id: "5",
        authorId: "3"
    },
    { 
        name: "The Light Fantastic",
        genre: "Fantasy",
        id: "6",
        authorId: "3"
    }
];

let authors = [
    {
        name: "Patrick Rothfuss",
        age: 44,
        id: "1"
    },
    {
        name: "Brandon Sanderson",
        age: 42,
        id: "2"
    },
    {
        name: "Terry Pratchett",
        age: 66,
        id: "3"
    }
];


// schema below 

const BookType = new GraphQLObjectType({

    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,

            resolve(parent, args) {
                // code to get data fron db / other source

                return _.find(authors, { id: parent.authorId });
            }
        } // end of 'author' field
    }) // end of 'fields'
});

const AuthorType = new GraphQLObjectType({

    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: graphql.GraphQLInt },
        books: {
            type: new GraphQLList(BookType),

            resolve(parent, args) {
                // code to get data from db / other source

                return _.filter(books, { authorId: parent.id });
            }
        } // end of 'books' field
    }) // end of 'fields
});

// root query
const RootQuery = new GraphQLObjectType({

    name: 'RootQueryType',
    fields: {

        book: {
            type: BookType,
            args: { 
                id: { type: GraphQLID }
            },

            resolve(parent, args) {
                // code to get data fron db / other source

                return _.find(books, { id: args.id });
            }
        },// end of 'book' field

        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID }
            },

            resolve(parent, args) {
                // code to get data fron db / other source

                return _.find(authors, { id: args.id });
            }
        } // emd of author field

    } // end of 'fields' attribute
});


module.exports = new GraphQLSchema({
    query: RootQuery
});