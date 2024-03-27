import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPosts, fetchTags, addPost } from "../api/api";

const PostList = () => {
  const [page, setPage] = React.useState(1);

  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    data: PostData,
  } = useQuery({
    queryKey: ["posts", { page }],
    queryFn: () => fetchPosts(page),
    staleTime: 10000 * 60 * 5,
  });

  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: Infinity,
  });

  const {
    mutate,
    isPending,
    error: postError,
    isError: isPostError,
    reset,
  } = useMutation({
    mutationFn: addPost,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"], exact: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
        exact: true,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    const tags = Array.from(formData.keys()).filter(
      (key) => formData.get(key) === "on"
    );

    if (!title || !tags) return;

    mutate({ id: PostData?.items + 1, title, tags });

    e.target.reset();
  };

  return (
    <div className="container mx-auto px-4 bg-gray-100 text-center flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-5xl font-bold mb-4 text-blue-600">Post List</h1>

      <form className="mb-3 space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter post title"
          name="title"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex flex-wrap gap-2">
          {tagsData?.map((tag) => {
            return (
              <div key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  id={tag}
                  name={tag}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={tag}
                  className="ml-2 text-sm font-medium text-gray-700"
                >
                  {tag}
                </label>
              </div>
            );
          })}
        </div>
        <button
          disabled={isPending}
          className="px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
        >
          {isPending ? "Posting..." : "Post"}
        </button>
      </form>

      {isLoading && <p className="text-lg text-gray-500">Loading...</p>}
      {isError && <p className="text-lg text-red-500">Error fetching data</p>}
      {isPostError && (
        <p className="text-lg text-red-500">{postError.message}</p>
      )}

      <div className="flex items-center justify-center space-x-2 mb-7">
        <button
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => setPage((oldPage) => Math.max(oldPage - 1, 0))}
          disabled={!PostData?.prev}
        >
          Previous
        </button>
        <span className="text-gray-700">{page}</span>
        <button
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() =>
            setPage((oldPage) => (!PostData.next ? oldPage : oldPage + 1))
          }
          disabled={!PostData?.next}
        >
          Next
        </button>
      </div>

      {PostData?.data?.map((post) => {
        return (
          <div
            key={post.id}
            className="mb-4 p-4 bg-white rounded shadow-lg w-full max-w-xl"
          >
            <h2 className="text-3xl font-semibold text-blue-500">
              {post.title}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm text-gray-600 bg-blue-200 rounded px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PostList;
