import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import "./App.css";
import { Routes, Route, Outlet, Link } from "react-router-dom";

import { useState } from "react";

type Todo = {
  id: number;
  title: string;
  content: string;
};

type NewTodo = {
  title: string;
  content: string;
};

export default function App() {
  return (
    <div>
      <h1>Loco Todo List</h1>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TodoList />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <div>
        <a href="https://loco.rs" target="_blank" rel="noreferrer">
          <img
            src="https://raw.githubusercontent.com/loco-rs/todo-list-example/4b8ade3ddfb5a2e076e5188cdc8f6cd404f3fdd1/frontend/src/assets/loco.svg"
            className="logo"
            alt="Loco logo"
          />
        </a>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}

function TodoList() {
  const queryClient = useQueryClient();

  const fetchTodos = async () => {
    const { data } = await axios.get(`api/notes`);
    return data;
  };

  const { isLoading, isError, data = [] } = useQuery(["todos"], fetchTodos); // a hook provided by react-query, it takes a key(name) and function that returns a promise

  const remove = async (id: number) => {
    try {
      const response = await axios.delete(`api/notes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error posting todo:", error);
      throw error;
    }
  };

  const mutation = useMutation(remove, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    },
  });

  console.log(data);
  if (isLoading)
    return (
      <div>
        <AddTodo />
        <div className="App">
          <p>isLoading...</p>
        </div>
      </div>
    );

  if (isError)
    return (
      <div>
        <AddTodo />
        <div className="App">
          <p>Could not get todo list from the server</p>
        </div>
      </div>
    );

  return (
    <div>
      <AddTodo />
      <div className="todo-list">
        {data.map((todo: Todo) => (
          <div key={todo.id} className="todo">
            <div>
              <div>
                {" "}
                <button
                  onClick={() => {
                    mutation.mutate(todo.id);
                  }}
                >
                  x
                </button>{" "}
                {todo.title}/
                {todo.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AddTodo() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const add = async (newTodo: NewTodo) => {
    try {
      const response = await axios.post(`api/notes`, {
        title: newTodo.title,
        content: newTodo.content,
      });
      return response.data;
    } catch (error) {
      console.error("Error posting todo:", error);
      throw error;
    }
  };

  const mutation = useMutation(add, {
    onSuccess: () => {
      setTitle("");
      setContent("");
      queryClient.invalidateQueries(["todos"]);
    },
  });

  return (
    <div className="todo-add">
      <input
        value={title}
        onChange={(event) => {
          setTitle(event.target.value);
        }}
        type="text"
      />
      <input
        value={content}
        onChange={(event) => {
          setContent(event.target.value);
        }}
        type="text"
      />
      <button
        onClick={() => {
          if (title !== "" && content !== "") {
            const newTodo = { title, content };
            mutation.mutate(newTodo);
          }
        }}
      >
        Add
      </button>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Sorry, this page not found</h2>
      <p>
        <Link to="/">Go to the todo list page</Link>
      </p>
    </div>
  );
}
