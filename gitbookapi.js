const fetch = require("node-fetch");
const GITBOOK_BASE_URL = "https://api-beta.gitbook.com/v1";

async function GitBookApiRequest({ endpoint, method = "GET", token }) {
  const url = `${GITBOOK_BASE_URL}${endpoint}`;
  console.log(url);
  return fetch(url, {
    method,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
}

module.exports = function GitBookApi(token) {
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
    getOwner: async ({ uid }) => {
      const result = await GitBookApiRequest({
        endpoint: `/owners/${uid}`,
        token,
      });
      return await result.json();
    },
    getSpaces: async ({ ownerId }) => {
      if (ownerId) {
        const result = await GitBookApiRequest({
          endpoint: `/owners/${ownerId}/spaces`,
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
    getSpace: async ({ ownerId, uid }) => {
      if (ownerId) {
        const result = await GitBookApiRequest({
          endpoint: `/owners/${ownerId}/spaces`,
          token,
        });
        return await result.json();
      }
      if (uid) {
        const result = await GitBookApiRequest({
          endpoint: `/spaces/${uid}`,
          token,
        });
        return await result.json();
      }
    },
    getSpaceContentAnalytics: async ({ spaceId }) => {
      /* API Method not found? */
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceId}/analytics/content`,
        token,
      });
      return await result.json();
    },
    getSpaceSearchAnalytics: async ({ spaceId }) => {
      /* Invalid Auth Token?? */
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceId}/analytics/search`,
        token,
      });
      return await result.json();
    },
    getContentRevision: async ({ spaceId }) => {
      console.log(spaceId);
      const result = await GitBookApiRequest({
        endpoint: `/spaces/${spaceId}/content`,
        token,
      });
      return await result.json();
    },
  };
};
