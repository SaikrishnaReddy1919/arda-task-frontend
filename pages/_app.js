import '../styles/globals.css'
import { MoralisProvider } from 'react-moralis'
import Header from '../components/Header'
import Head from 'next/head'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
})

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>IL Calculate</title>
        <meta name="description" content="IL" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <ApolloProvider client={client}>
          <Header />
          <Component {...pageProps} />
        </ApolloProvider>
      </MoralisProvider>
    </div>
  )
}

export default MyApp
