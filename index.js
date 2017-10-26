const express         = require('express')
const app             = express()
const graphqlHTTP     = require('express-graphql')
const { buildSchema } = require('graphql')
const API_PORT        = '4242';
// actual data and constructor functions for objects
function Person(name, surname, bookTitle, rocks) {
  this.name    = name
  this.surname = surname
  this.books   = bookTitle.map((book) => {
    return new Book(book)
  })
  this.rocks   = rocks
}
function Book(title) {
  this.title = title
}
const persons = [
  new Person('Robert C.', 'Martin', ['Clean Coder', 'Clean Code'], 'UNSURE'),
  new Person('Kent', 'Beck', ['Implementation Patterns', 'Extreme Programming'], 'YES'),
  new Person('Douglas', 'Crockford', ['JavaScript: The Good Parts'], 'YES')
]
// the schema used by graphql
const schema = buildSchema(`
  type Query {
    person(surname: String!): Person
  }
  
  type Person {
    name: String!,
    surname: String!,
    books: [Book]!,
    rocks: Rocks!
  }
  
  type Book {
    title: String!
  }
  
  enum Rocks {
    YES,
    NO,
    UNSURE
  }
`)
// resolver used to do the actual query
const root = {
  person({ surname }) {
    return persons.find((person) => person.surname === surname)
  }
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(API_PORT, () => console.log(`CMD + click: http://localhost:${API_PORT}/graphql`))

/*
Example query:

{
  person(surname: "Martin") {
    name
    surname
    rocks
  }
}
*/