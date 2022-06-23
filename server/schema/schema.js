const graphql = require('graphql');
const Book = require('../models/books');
const Author = require('../models/authors');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;


const BookType = new GraphQLObjectType({

    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,

            resolve(parent, args) {
                return Author.findById(parent.authorId);
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
                return Book.find({ authorId: parent.id });
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
                return Book.findById(args.id);
            }
        }, // end of 'book' field

        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID }
            },

            resolve(parent, args) {
                return Author.findById(args.id);
            }
        }, // end of 'author' field

        books: {
            type: new GraphQLList(BookType),
            
            resolve(parent, args) {
                return Book.find({});
            }
        }, // end of 'books' field

        authors: {
            type: new GraphQLList(AuthorType),

            resolve(parent, args) {
                return Author.find({});
            }
        } // end of 'authors' field

    } // end of 'fields' attribute
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {

        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },

            resolve(parent, args) {
                const author = new Author({
                    name: args.name,
                    age: args.age
                });

                return author.save();
            } // end of resolve
        }, // end of addAuthor

        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },

            resolve(parent, args) {
                const book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return book.save();
            } // end of resolve
        } // end of addBook
    } // end of fields
});


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
