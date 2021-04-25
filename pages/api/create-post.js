import { query } from "faunadb";
import { faunaClient, FAUNA_SECRET_COOKIE } from "../../utils/fauna-auth";
import cookie from "cookie";
const { Call, Function: Fn } = query;

export default async function createPost(req, res) {
  const cookies = cookie.parse(req.headers.cookie ?? "");
  const faunaSecret = cookies[FAUNA_SECRET_COOKIE];

  if (!faunaSecret) {
    return res.status(401).send("Auth cookie missing.");
  }

  return faunaClient(faunaSecret)
    .query(Call(Fn("createPost"), req.body.description))
    .then((newPostContent) => {
      res.status(200).send(newPostContent);
    })
    .catch((err) => {
      console.log(err);
      if (err.message) {
        if (err.message == "unauthorized")
          return res.status(401).send("invalid Auth cookie");
        throw new Error(err.message);
      }
      return res.status(400).send(err.message);
    });
}
