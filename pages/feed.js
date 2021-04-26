import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { withAuthSync } from "../utils/auth";

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (res.status >= 300) {
      throw new Error("API Client error");
    }

    return res.json();
  });

const Feed = () => {
  const router = useRouter();
  const { data: feed, error: feedErr } = useSWR("./api/list-feed", fetcher);
  useEffect(() => {
    if (feedErr) {
      router.push("/signin");
      console.log(feedErr);
    }
  }, [feedErr, router]);
  console.log(feed);

  const [postData, setPostData] = useState({
    description: "",
    error: "",
  });
  const [posting, setPosting] = useState(false);

  const createNewPost = async (content) => {
    setPosting(true);

    const response = await fetch("./api/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: content.target.description.value }),
    });

    if (response.status !== 200) {
      setPosting(false);
      throw new Error(await response.text());
    }

    setPosting(false);
    setPostData({ ...postData, description: "" });
  };

  const handleSubmit = async (content) => {
    content.preventDefault();

    try {
      await createNewPost(content);
    } catch (error) {
      console.error(error);
      setPostData({ ...postData, error: error.message });
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row justify-content-center mt-5">
          <div className="col-4 border p-4 rounded">
            <h2 className="text-center mb-4">Hi, What's Popping</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <textarea
                  rows="4"
                  disabled={posting}
                  type="text"
                  name="description"
                  className="form-control"
                  value={postData.description}
                  onChange={(event) =>
                    setPostData(
                      Object.assign({}, postData, {
                        description: event.target.value,
                      })
                    )
                  }
                />
              </div>

              <button
                type="submit"
                disabled={posting}
                className="btn btn-primary w-100 mt-3"
              >
                {posting ? "Posting..." : "Post"}
              </button>

              {postData.error && (
                <small className="mt-3 text-danger">
                  Error: {postData.error}
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthSync(Feed);
