import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { resolvers, typeDefs } from './src/schema'
import bodyParser from 'body-parser'

const startApolloServer = async (typeDefs, resolvers) => {
  const app = express()
  const httpServer = http.createServer(app)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  await server.start()

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token })
    })
  )

  await new Promise(resolve => httpServer.listen({ port: 3000 }, resolve))
  console.log(`Server: http://localhost:3000/graphql`)
}

startApolloServer(typeDefs, resolvers)