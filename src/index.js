import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { FronteggProvider } from '@frontegg/react';
import { ContextHolder } from '@frontegg/rest-api';
import { setContext } from '@apollo/client/link/context';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink
} from "@apollo/client";

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
        }
    }
});


const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

const contextOptions = {
    baseUrl: 'https://samples-demo.frontegg.com',
    clientId: '2e53360e-517e-4c38-a040-ba0e8639f2c7'
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <FronteggProvider contextOptions={contextOptions} hostedLoginBox={true}>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </FronteggProvider>,
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
