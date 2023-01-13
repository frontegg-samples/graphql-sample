const { ApolloServer } = require('@apollo/server');
const { IdentityClient } = require('@frontegg/client');
const { startStandaloneServer } = require('@apollo/server/standalone');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
  
  type Mutation {
    addBook(title: String!, author: String!): Book
  }
`;

const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
];

function validateAuthentication(context) {
    if (!context.user) {
        throw new Error('Unauthorized');
    }
}

function validateAuthorization(context, permission) {
    if (!context.user?.permission?.contains(permission)) {
        throw new Error('Forbidden');
    }
}
// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: (parent, args, context, info) => {
            validateAuthentication(context);
            console.log(context);
            return books;
        },
    },
    Mutation: {
        addBook: async (_, {title, author}, context) => {
            validateAuthorization(context, 'write.book');
            const book = {title, author};
            books.push(book);
            return book;
        }
    }
}

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

async function getScope(authorizationHeader) {
    try {
        const user = await IdentityClient.getInstance().validateIdentityOnToken(authorizationHeader);
        return user;
    } catch (e) {
        return { name: 'john doe' };
    }
}

startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req, res }) => ({
        authScope: await getScope(req.headers.authorization),
    }),
}).then(( {url }) => {
    console.log(`🚀  Server ready at: ${url}`);
});


