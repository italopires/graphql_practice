// const { ApolloServer, gql } = require('apollo-server');
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

const users = [{
  id: 1,
  name: 'João Silva',
  email: 'jsilva@gmail.com',
  age: 29,
  profile_id: 1
}, {
  id: 2,
  name: 'Rafael Júnior',
  email: 'rafaelj@gmail.com',
  age: 31,
  profile_id: 2
}, {
  id: 3,
  name: 'Daniel Smith',
  email: 'danism@gmail.com',
  age: 24,
  profile_id: 1
}]

const profiles = [{
  id: 1,
  name: 'Common'
}, {
  id: 2,
  name: 'Administrator'
}]

const typeDefs = gql`
  scalar Date

  type Profile {
    id: ID
    name: String
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    salary: Float
    vip: Boolean
    profile: Profile
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
    megaSenaNumbers: [Int!]!
    users: [User]
    user(id: ID): User
    profiles: [Profile]
    profile(id: ID): Profile
  }

`;

const resolvers = {
  User: {
    salary(user) {
      return user.real_salary
    },
    profile(user) {
      const profile = profiles.filter(p => p.id = user.profile_id)[0]
      return profile ? profile[0] : null
    }
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
        price: 30,
        discount: 0.5,
      }
    },
    megaSenaNumbers() {
      const ascending = (a, b) => a - b;
      return Array(6).fill(0).map(n => parseInt(Math.random() * 60 + 1)).sort(ascending);
    },
    users() {
      return users;
    },
    user(_, args) {
      const selecteds = users.filter(u => u.id === parseInt(args.id))

      return selecteds ? selecteds[0] : null;
    },
    profiles() {
      return profiles;
    },
    profile(_, { id }) {
      const profile = profiles.filter(p => p.id === parseInt(id));

      return profile ? profile[0] : null;
    }
  },
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