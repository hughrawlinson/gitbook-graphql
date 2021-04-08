import fetch from "node-fetch";

const GITBOOK_BASE_URL = "https://api-beta.gitbook.com/v1";

type GitBookApiRequestArgs = {
  endpoint: string;
  method?: string;
  token: string;
};

async function GitBookApiRequest({
  endpoint,
  method = "GET",
  token,
}: GitBookApiRequestArgs) {
  const url = `${GITBOOK_BASE_URL}${endpoint}`;
  return fetch(url, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

type UidArgs = {
  uid: string;
};

type OwnerIdArgs = {
  ownerId: string;
};

type SpaceIdArgs = {
  spaceId: string;
};

function isOwnerIdArgs(value: unknown): value is OwnerIdArgs {
  return (
    (value as OwnerIdArgs).ownerId !== undefined &&
    typeof (value as OwnerIdArgs).ownerId === "string"
  );
}

export default function GitBookApi(token: string) {
  return {
    getUser: async () => {
      const result = await GitBookApiRequest({
        endpoint: "/user",
        token,
      });
      return await result.json();
    },
    getOrgs: async () => {
      const result = await GitBookApiRequest({
        endpoint: "/orgs",
        token,
      });
      return await result.json();
    },
    getOwner: async ({ uid }: UidArgs) => {
      const result = await GitBookApiRequest({
        endpoint: `/owners/${uid}`,
        token,
      });
      return await result.json();
    },
    getSpaces: async (arg?: OwnerIdArgs) => {
      if (arg.ownerId) {
        const result = await GitBookApiRequest({
          endpoint: `/owners/${arg.ownerId}/spaces`,
          token,
        });
        return await result.json();
      }
      const result = await GitBookApiRequest({
        endpoint: "/user/spaces",
        token,
      });
      return await result.json();
    },
    getSpace: async (spaceArgs: UidArgs | OwnerIdArgs) => {
      if (isOwnerIdArgs(spaceArgs)) {
        const result = await GitBookApiRequest({
          endpoint: `/owners/${spaceArgs.ownerId}/spaces`,
          token,
        });
        return await result.json();
      }
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceArgs.uid}`,
        token,
      });
      return await result.json();
    },
    getSpaceContentAnalytics: async ({ spaceId }: SpaceIdArgs) => {
      /* API Method not found? */
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceId}/analytics/content`,
        token,
      });
      return await result.json();
    },
    getSpaceSearchAnalytics: async ({ spaceId }: SpaceIdArgs) => {
      /* Invalid Auth Token?? */
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceId}/analytics/search`,
        token,
      });
      return await result.json();
    },
    getContentRevision: async ({ spaceId }: SpaceIdArgs) => {
      console.log(spaceId);
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceId}/content`,
        token,
      });
      return await result.json();
    },
  };
}
