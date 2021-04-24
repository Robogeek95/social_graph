import { useState } from "react";
import Router from "next/router";

function signin() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    error: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignin = async (email, password) => {
    setLoading(true);

    const response = await fetch("./api/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.status !== 200) {
      setLoading(false);
      throw new Error(await response.text());
    }

    setLoading(false);
    Router.push("/");
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setUserData({ ...userData, error: "" });

    const email = userData.email;
    const password = userData.password;

    try {
      await handleSignin(email, password);
    } catch (error) {
      console.error(error);
      setUserData({ ...userData, error: error.message });
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="row justify-content-center mt-5">
        <div className="col-4 border p-4 rounded">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                type="text"
                id="email"
                name="email"
                className="form-control"
                value={userData.email}
                onChange={(event) =>
                  setUserData(
                    Object.assign({}, userData, { email: event.target.value })
                  )
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                value={userData.password}
                onChange={(event) =>
                  setUserData(
                    Object.assign({}, userData, {
                      password: event.target.value,
                    })
                  )
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 mt-3"
            >
              {loading ? "Loading..." : "Signin"}
            </button>

            {userData.error && (
              <small className="mt-3 text-danger">
                Error: {userData.error}
              </small>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default signin;
