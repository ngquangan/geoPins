const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    _id: ID!,
    name: String,
    email: String,
    picture: String,
  }

  type Pin {
    _id: ID
    title: String
    content: String
    image: String
    latitude: Float
    longitude: Float
    author: User
    comments: [Comment]
    createdAt: String
  }

  type Comment {
    text: String
    author: User
    createdAt: String
  }

  type Query {
    me: User
  }
`