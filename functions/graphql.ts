import { Handler } from "@netlify/functions";
import { ApolloServer } from "apollo-server-lambda";
import { typeDefs, resolvers } from "../apolloserver";

export const netlifyServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event, context, express }: any) => ({
    headers: event.headers,
    functionName: context.functionName,
    event,
    context,
    expressRequest: express.req,
  }),
});

const handler: Handler = netlifyServer.createHandler();

export { handler };
