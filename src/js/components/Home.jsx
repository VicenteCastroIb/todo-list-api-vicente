import React, { useEffect, useState } from "react";

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const username = "vicente"; 
    const baseUrl = "https://playground.4geeks.com/todo";

    useEffect(() => {
        getTasks();
    }, []);


    const getTasks = () => {
        fetch(`${baseUrl}/users/${username}`)
            .then((resp) => {
                if (resp.status === 404) {
                    return createUser();
                }
                if (!resp.ok) throw Error("Error al obtener tareas");
                return resp.json();
            })
            .then((data) => {
                if (data && data.todos) {
                    setTasks(data.todos);
                }
            })
            .catch((error) => console.error(error));
    };


    const createUser = () => {
        fetch(`${baseUrl}/users/${username}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then((resp) => {
                if (resp.ok) getTasks();
            })
            .catch((error) => console.error("Error creando usuario:", error));
    };


    const addTask = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const newTask = {
                label: inputValue.trim(),
                is_done: false
            };

            fetch(`${baseUrl}/todos/${username}`, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setTasks([...tasks, data]);
                    setInputValue("");
                })
                .catch((error) => console.error("Error al agregar:", error));
        }
    };


    const deleteTask = (id) => {
        fetch(`${baseUrl}/todos/${id}`, {
            method: "DELETE",
        })
            .then((resp) => {
                if (resp.ok) {
                    setTasks(tasks.filter((t) => t.id !== id));
                }
            })
            .catch((error) => console.error("Error al borrar:", error));
    };


    const clearAllTasks = () => {
        fetch(`${baseUrl}/users/${username}`, {
            method: "DELETE",
        })
            .then((resp) => {
                if (resp.ok) {
                    setTasks([]);
                    createUser();
                }
            })
            .catch((error) => console.error("Error al limpiar todo:", error));
    };

    return (
        <div className="container">
            <h1 className="text-center mt-5">Lista Tareas</h1>

            <div className="todo-box shadow">
                <input
                    type="text"
                    className="form-control"
                    placeholder="¿Qué necesitas hacer?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={addTask}
                />

                <ul className="list-group">
                    {tasks.length === 0 ? (
                        <li className="list-group-item text-muted">
                            No hay tareas, añadir tareas
                        </li>
                    ) : (
                        tasks.map((item) => (
                            <li key={item.id} className="list-group-item task">
                                <span className="task-text">{item.label}</span>
                                <span
                                    className="borrar"
                                    onClick={() => deleteTask(item.id)}
                                >
                                    ❌
                                </span>
                            </li>
                        ))
                    )}
                </ul>

                <div className="pendientes d-flex justify-content-between align-items-center">
                    <span>{tasks.length} {tasks.length === 1 ? "tarea" : "tareas"} pendientes</span>

                    {tasks.length > 0 && (
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={clearAllTasks}
                        >
                            Limpiar todo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoList;