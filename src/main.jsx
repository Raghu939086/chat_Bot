import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';              // ✅ your App
import { NhostProvider } from '@nhost/react';
import { nhost } from './nhost';          // ✅ from src/nhost.js
import { ApolloProvider } from '@apollo/client';
import { apollo } from './apollo';        // ✅ from src/apollo.js

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NhostProvider nhost={nhost}>
      <ApolloProvider client={apollo}>
        <App />
      </ApolloProvider>
    </NhostProvider>
  </React.StrictMode>
);
