import fetch from "node-fetch";

const GITBOOK_BASE_URL = process.env.GITBOOK_API_HOST;

type GitBookApiRequestArgs = {
  endpoint: string;
  method?: string;
  token: string;
};

interface ApiError {
  error: {
    code: number;
    message: string;
  };
}

function isApiError(v: unknown): v is ApiError {
  return v.hasOwnProperty("error");
}

async function GitBookApiRequest({
  endpoint,
  method = "GET",
  token,
}: GitBookApiRequestArgs) {
  const url = `${GITBOOK_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    new Error(`GitBook API request failed: ${url}`);
  }
  const json: unknown = await response.json();
  if (isApiError(json)) {
    console.log(json);
  }
  return json;
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
      return result;
    },
    getOrgs: async () => {
      const result = await GitBookApiRequest({
        endpoint: "/orgs",
        token,
      });
      return result;
    },
    getOwner: async ({ uid }: UidArgs) => {
      const result = await GitBookApiRequest({
        endpoint: `/owners/${uid}`,
        token,
      });
      return result;
    },
    getSpaces: async (arg?: OwnerIdArgs) => {
      if (arg && arg.ownerId) {
        const result = await GitBookApiRequest({
          endpoint: `/owners/${arg.ownerId}/spaces`,
          token,
        });
        return result;
      }
      const result = await GitBookApiRequest({
        endpoint: "/user/spaces",
        token,
      });
      return result;
    },
    getSpace: async (spaceArgs: UidArgs | OwnerIdArgs) => {
      if (isOwnerIdArgs(spaceArgs)) {
        const result = await GitBookApiRequest({
          endpoint: `/owners/${spaceArgs.ownerId}/spaces`,
          token,
        });
        return result;
      }
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceArgs.uid}`,
        token,
      });
      return result;
    },
    getSpaceContentAnalytics: async ({ spaceId }: SpaceIdArgs) => {
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceId}/analytics/content`,
        token,
      });
      return result;
    },
    getSpaceSearchAnalytics: async ({ spaceId }: SpaceIdArgs) => {
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceId}/analytics/search`,
        token,
      });
      return result;
    },
  };
}
