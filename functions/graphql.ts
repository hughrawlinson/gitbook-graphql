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

const apolloHandler: Handler = netlifyServer.createHandler();

const handler: Handler = (event: any, context: any, ...args) => {
  return apolloHandler(
    {
      ...event,
      requestContext: context,
    },
    context,
    ...args
  );
};

export { handler };
