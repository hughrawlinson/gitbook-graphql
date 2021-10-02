import { ApolloServer } from "apollo-server-express";
import express from "express";
import { typeDefs, resolvers } from "./apolloserver.js";

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    gitbookApiToken: req.headers.authorization.split(" ")[1],
  }),
});

const app = express();

app.get("/", (req, res) => {
  res.send(`<html>
  <head>
    <title>Simple GraphiQL Example</title>
    <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
  </head>
  <body style="margin: 0;">
    <div id="graphiql" style="height: 100vh;"></div>

    <script
      crossorigin
      src="https://unpkg.com/react/umd/react.production.min.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/graphiql/graphiql.min.js"
    ></script>

    <script>
      const fetcher = GraphiQL.createFetcher({ url: '/graphql' });

      ReactDOM.render(
        React.createElement(GraphiQL, { fetcher: fetcher, headerEditorEnabled: true, shouldPersistHeaders: true }),
        document.getElementById('graphiql'),
      );
    </script>
  </body>
</html>`);
});

await server.start();

server.applyMiddleware({ app });

app.listen({ port: process.env.PORT || 4000 }, () => {
  console.log("Server ready!");
});
