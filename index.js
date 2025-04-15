require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const neo4j = require('neo4j-driver');
const resolvers = require('./resolvers');

// Create the Neo4j driver
const uri = process.env.NEO4J_URI;
const username = process.env.NEO4J_USERNAME;
const password = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

// GraphQL Schema
const typeDefs = gql`
  type Character {
    name: String
    height: String
    mass: String
    hair_color: String
    skin_color: String
    eye_color: String
    birth_year: String
    gender: String
    homeworld: String
    species: String
  }

  type Query {
    characters: [Character]
    character(name: String!): Character
  }

  type Mutation {
    createCharacter(
      name: String
      height: String
      mass: String
      hair_color: String
      skin_color: String
      eye_color: String
      birth_year: String
      gender: String
      homeworld: String
      species: String
    ): Character

    updateCharacter(
      name: String!
      mass: String
      gender: String
      birth_year: String
    ): Character

    deleteCharacter(name: String!): String
  }
`;

// Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ driver })
});

server.listen(4000).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});