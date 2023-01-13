# Getting Started with Frontegg Hosted Login-Box and GraphQL APIS

This sample is aimed at consuming GraphQL APIs behind the Frontegg authenticated guards

## Running the sample

After cloning the project, install it using

### `npm install`

In order to run the project, run
### `npm start`

The application will be opened on [http://localhost:3000](http://localhost:3000) in development mode
Go ahead and login to the application.

After the login, you can see the `Call my graphql server` button.
Clicking on this will invoke the SpaceX GraphQL API to get some of the latest launches.

In order to pass the authentication details to the Apollo client we used the http link:

    const uri = 'https://api.spacex.land/graphql';
    const httpLink = createHttpLink({
        uri,
    });
    
    const authLink = setContext((_, { headers }) => {
        // get the authentication token from local storage if it exists
        const token = ContextHolder.getAccessToken();
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : "",
            },  
        }
    });
    
    
    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: authLink.concat(httpLink),
    });
