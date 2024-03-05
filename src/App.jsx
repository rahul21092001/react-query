import { useState } from "react";
import PostList from "./components/PostList";

function App() {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="text-center">
      <button
        onClick={() => setToggle(!toggle)}
        className="px-4 py-2 mt-3 mb-3 font-semibold text-white bg-blue-500 rounded hover:bg-blue-700"
      >
        Toggle
      </button>

      {toggle && <PostList />}
    </div>
  );
}

export default App;
