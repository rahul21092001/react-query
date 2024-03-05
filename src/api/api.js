export const fetchPosts = async (page) => {
  try {
    const response = await fetch(
      `http://localhost:3000/posts?_sort=-id&${
        page ? `_page=${page}&_per_page=5` : ""
      }`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

export const fetchTags = async () => {
  try {
    const response = await fetch("http://localhost:3000/tags");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

export const addPost = async (post) => {
  try {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding post: ", error);
  }
};
