const { gql } = require('apollo-server');

// GraphQL Schema definition
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
    createCharacter(name: String!, height: String, mass: String): Character
    updateCharacter(name: String!, mass: String, gender: String, birth_year: String): Character
    deleteCharacter(name: String!): String
  }
`;

module.exports = typeDefs;