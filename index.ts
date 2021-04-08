import { ApolloServer, gql, IResolvers } from "apollo-server";
import GitBookApi from "./gitbookapi";

const gitbookApi = GitBookApi(process.env.GITBOOK_API_TOKEN);

const typeDefs = gql`
  interface Owner {
    uid: String
    kind: String
    title: String
    spaces: [Space]
  }

  type User implements Owner {
    uid: String
    kind: String
    title: String
    spaces: [Space]
  }

  type Org implements Owner {
    uid: String
    kind: String
    title: String
    spaces: [Space]
  }

  type Space {
    uid: String
    name: String
    baseName: String
    private: Boolean
    unlisted: Boolean
    contentAnalytics: [SpacePageContentAnalyticsPage]
    searchAnalytics: [SpacePageSearchAnalytics]
    content: ContentRevision
  }

  type SpacePageContentAnalyticsPage {
    uid: String
    uniqueVisitors: Int
    pageViews: Int
    timeOnPage: Int
  }

  type SpacePageSearchAnalytics {
    searches: Int
    queries: [SpacePageSearchAnalyticsQuery]
  }

  type SpacePageSearchAnalyticsQuery {
    query: String
    searches: Int
    hits: Int
  }

  type Query {
    me: User
    myOrgs: [Org]
    mySpaces: [Space]
    user(uid: String!): User
    org(uid: String!): Org
    owner(uid: String!): Owner
    spaces(ownerId: String): [Space]
    space(uid: String!): Space
  }

  type ContentRevision {
    uid: String
    parents: [String]
    variants: [Variant]
    assets: [Asset]
  }

  type Variant {
    uid: String
    ref: String
    title: String
    page: Page
  }

  type Page {
    uid: String
    title: String
    description: String
    path: String
    kind: String
    pages: [Page]
  }

  type Asset {
    uid: String
    name: String
    downloadURL: String
    contentType: String
  }
`;

const resolvers: IResolvers<any, any> = {
  Query: {
    me: async () => {
      return await gitbookApi.getUser();
    },
    myOrgs: async () => {
      const orgs = await gitbookApi.getOrgs();
      return orgs.items;
    },
    mySpaces: async () => {
      const spaces = await gitbookApi.getSpaces();
      return spaces.items;
    },
    user: async (parent, args) => {
      return await gitbookApi.getOwner({ uid: args.uid });
    },
    org: async (parent, args) => {
      return await gitbookApi.getOwner({ uid: args.uid });
    },
    owner: async (parent, args) => {
      return await gitbookApi.getOwner({ uid: args.uid });
    },
    spaces: async (_, args) => {
      const spaces = await gitbookApi.getSpaces({ ownerId: args.ownerId });
      return spaces.items;
    },
    space: async (_, args) => {
      const space = await gitbookApi.getSpace({ uid: args.uid });
      return space;
    },
  },
  Owner: {
    __resolveType(owner: { kind: string }) {
      if (owner.kind === "user") {
        return "User";
      } else if (owner.kind === "org") {
        return "Org";
      }
      return null;
    },
  },
  User: {
    spaces: async (parent, args) => {
      const spaceResult = await gitbookApi.getSpace({
        ownerId: parent.uid || args.uid,
      });
      return spaceResult.items;
    },
  },
  Org: {
    spaces: async (parent, args) => {
      const spaceResult = await gitbookApi.getSpace({
        ownerId: parent.uid || args.uid,
      });
      return spaceResult.items;
    },
  },
  Space: {
    contentAnalytics: async (parent) => {
      const spaceContentAnalytics = await gitbookApi.getSpaceContentAnalytics({
        spaceId: parent.uid,
      });
      return spaceContentAnalytics.pages;
    },
    searchAnalytics: async (parent) => {
      const spaceSearchAnalytics = await gitbookApi.getSpaceSearchAnalytics({
        spaceId: parent.uid,
      });
      return spaceSearchAnalytics.pages;
    },
    content: async (parent) => {
      const content = await gitbookApi.getContentRevision({
        spaceId: parent.uid,
      });
      console.log(content);
      return content;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
