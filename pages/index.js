import { useRouter } from "next/router";
import { logout } from "../utils/auth";

const Home = () => {
  const router = useRouter();
  return (
    <div className="container">
      <div>
        <h1>Basic social graph example</h1>

        <p>Steps to test the features:</p>

        <ol>
          <li>
            Click signup and create an account, this will also log you in.
          </li>
          <li>
            Click home and click feed, notice how your session is being
            used through a token stored in a cookie.s
          </li>
          <li>
            Click logout and try to go to feed again. You'll get redirected
            to the `/login` route.
          </li>
        </ol>
        <div className="row mt-5">
          <div
            className="col-3 border p-4 rounded text-center"
            onClick={() => router.push("/signup")}
          >
            SignUp
          </div>
          <div
            className="col-3 border p-4 rounded text-center"
            onClick={() => router.push("/signin")}
          >
            Login
          </div>
          <div
            className="col-3 border p-4 rounded text-center"
            onClick={logout}
          >
            Logout
          </div>
          <div
            className="col-3 border p-4 rounded text-center"
            onClick={() => router.push("/feed")}
          >
            Feed
          </div>
        </div>
      </div>
      <style jsx>{`
        li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Home;
