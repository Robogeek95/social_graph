import { query } from "faunadb";
const { Function: Fn, Call } = query;
import { serverClient, serializeFaunaCookie } from "../../utils/fauna-auth";

export default async function signup(req, res) {
  const { email, password } = await req.body;

  try {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    return serverClient
      .query(Call(Fn("signupUser"), [email, password]))
      .then((loginRes) => {
        if (!loginRes.secret) {
          throw new Error("No secret present in login query response.");
        }

        const cookieSerialized = serializeFaunaCookie(loginRes.secret);

        res.setHeader("Set-Cookie", cookieSerialized);
        res.status(200).end();
      })
      .catch((err) => {
        console.log({ err });
        res.status(400).send(err.message);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
}
