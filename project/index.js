// const { ApolloServer, gql } = require('apollo-server');
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const typeDefs = gql`
  scalar Date

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    salary: Float
    vip: Boolean
  }
  type Product {
    name: String!
    price: Float!
    discount: Float
    priceWithDiscount: Float
  }

  # Entry points for the API!
  type Query {
    hello: String!
    currentTime: Date!
    signedInUser: User
    productInHighlight: Product
  }

`;

const resolvers = {
  User: {
    salary(user) {
      return user.real_salary
    },
  },
  Product: {
    priceWithDiscount(product) {
      if (product.discount) return product.price * (1 - product.discount)

      return product.price
    }
  },
  Query: {
    hello() {
      return 'Just returns a string'
    },
    currentTime() {
      return new Date()
    },
    signedInUser(obj) {
      console.log(obj);
      return {
        id: 1,
        name: 'Ana',
        email: 'ana@gmail.com',
        age: 35,
        real_salary: 1234.56,
        vip: true
      }
    },
    productInHighlight() {
      return {
        name: 'Product 1',
        price: 33.8,
        discount: 0.5,
      }
    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
})

// server.listen().then(({ url }) => {
//   console.log(`Executing in ${url}`)
// })

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});