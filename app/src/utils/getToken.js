export default async function (getAccessTokenSilently) {
    return getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE || "http://localhost:3000/",
        scope: "user",
      });
}