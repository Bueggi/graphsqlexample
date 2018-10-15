const { GraphQLServer } = require ('graphql-yoga');


// GraphQL schema
// Commented out and transfered to schema.graphql
// const typeDefs =`
// type Query {
//   info: String!
//   feed: [Link!]!
// }
//
// type Mutation {
//   post(url: String!, description: String!): Link!
// }
//
// type Link {
//   id: ID!
//   description: String!
//   url: String!
// }
// `

// Data for now
let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
},
{
  id: 'link-1',
  url: 'www.xxx.com',
  description: 'Lul'
}]

let idCount = links.length;

// Implemenmtztion of the schema
// root argument:
// every revolver function has 4 input arguments:
// 1. called root is result of previous execution lvl
// each lvl of nesting can use root

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (root,args) => {
      return links.filter((obj) => {
        return obj.id === args.id;
      });
    }
  },
  Mutation: {
    post: (root,args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (root,args) => {
      let newLink = {};
      links.forEach( (obj) => {
        if(obj.id === args.id) {
          obj.description = args.description;
          obj.url = args.url;
          newLink = obj;
          return;
        }
      })
      return newLink;
    },
    deleteLink: (root,args) => {
      let currentLink = {};
      links.forEach ((obj,index) => {
        if(obj.id === args.id) {
          delete links[index];
          currentLink = obj;
          return;
        }
      })
      return currentLink;
    }
  },
  // Below can be commented out because graphql knows from the schema
  // Link: {
  //   id: (root) => root.id,
  //   description: (root) => root.description,
  //   url: (root) => root.url,
  // }
}

// Schema and resolvers are bundled and passed to the graphQLServer
// Server from yoga
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
})

server.start(() => console.log('server is running on http://localhost:4000'));
