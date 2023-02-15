if (
  import.meta.env.PROD &&
  (!import.meta.env.FAUNA_KEY || !import.meta.env.FAUNA_GRAPHQL_HOST)
) {
  throw new Error(
    "ERROR: FAUNA_KEY and/or FAUNA_GRAPHQL_HOST env not defined!"
  );
}

export const graphQLRequest = async <T>(
  query: string,
  variables: Record<string, any> = {}
): Promise<{
  data: T | null;
  errors:
    | [
        {
          message: string;
        }
      ]
    | null;
}> => {
  const url = new URL("/graphql", import.meta.env.FAUNA_GRAPHQL_HOST);

  try {
    return fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: "Bearer " + import.meta.env.FAUNA_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }).then((res) => res.json());
  } catch (e) {
    console.error((e as Error).message);

    return {
      data: null,
      errors: [
        {
          message: (e as Error).message,
        },
      ],
    };
  }
};
