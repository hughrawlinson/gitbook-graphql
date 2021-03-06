import { gql } from "apollo-server-express";
import { IResolvers } from "@graphql-tools/utils";
import GitBookApi from "./gitbookapi.js";

export const typeDefs = gql`
  interface Owner {
    kind: String
    id: String
  }

  type User implements Owner {
    id: String
    kind: String
    displayName: String
    photoURL: String
    spaces: [Space]
  }

  type Me implements Owner {
    id: String
    kind: String
    displayName: String
    photoURL: String
    spaces: [Space]
    orgs: [Org]
  }

  type Org implements Owner {
    id: String
    kind: String
    title: String
    spaces: [Space]
  }

  type Space {
    id: String
    title: String
    path: String
    visibility: String
    contentAnalytics: [SpacePageContentAnalyticsPage]
    searchAnalytics: SpacePageSearchAnalytics
  }

  type SpacePageContentAnalyticsPageFeedback {
    score: Int
    total: Int
    rating: String
    bad: Int
    ok: Int
    good: Int
  }

  type SpacePageContentAnalyticsPage {
    page: String
    title: String
    pageViews: Int
    feedbacks: SpacePageContentAnalyticsPageFeedback
  }

  type SpacePageSearchAnalytics {
    searches: Int
    queries: [SpacePageSearchAnalyticsQuery]
  }

  type SpacePageSearchAnalyticsQuery {
    query: String
    searches: Int
    hits: Int
    pageHits: Int
    sectionHits: Int
  }

  type Query {
    me: Me
    user(uid: String!): User
    org(uid: String!): Org
    owner(uid: String!): Owner
    spaces(ownerId: String): [Space]
    space(uid: String!): Space
  }
`;

export const resolvers: IResolvers<any, any> = {
  Query: {
    me: async (_, _1, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      return await gitbookApi.getUser();
    },
    user: async (_, args, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      return await gitbookApi.getOwner({ uid: args.uid });
    },
    org: async (_, args, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      return await gitbookApi.getOwner({ uid: args.uid });
    },
    owner: async (_, args, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      return await gitbookApi.getOwner({ uid: args.uid });
    },
    spaces: async (_, args, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      const spaces: any = await gitbookApi.getSpaces({ ownerId: args.ownerId });
      return spaces.items;
    },
    space: async (_, args, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      const space: any = await gitbookApi.getSpace({ uid: args.uid });
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
  Me: {
    orgs: async (_, _1, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      const orgs: any = await gitbookApi.getOrgs();
      return orgs.items!;
    },
    spaces: async (_, _1, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      const spaces: any = await gitbookApi.getSpaces();
      return spaces.items;
    },
  },
  User: {
    spaces: async (parent, args, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      const spaceResult: any = await gitbookApi.getSpace({
        ownerId: parent.uid || args.uid,
      });
      return spaceResult.items;
    },
  },
  Org: {
    spaces: async (parent, args, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      const spaceResult: any = await gitbookApi.getSpace({
        ownerId: parent.uid || args.uid,
      });
      return spaceResult.items;
    },
  },
  Space: {
    contentAnalytics: async (parent, _, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      const spaceContentAnalytics: any =
        await gitbookApi.getSpaceContentAnalytics({
          spaceId: parent.uid,
        });
      return spaceContentAnalytics.pages;
    },
    searchAnalytics: async (parent, _, context) => {
      const gitbookApi = GitBookApi(context.gitbookApiToken);
      const spaceSearchAnalytics: any =
        await gitbookApi.getSpaceSearchAnalytics({
          spaceId: parent.uid,
        });
      return spaceSearchAnalytics;
    },
  },
};
