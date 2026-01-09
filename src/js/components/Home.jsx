import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const baseUrl = "https://playground.4geeks.com/todo";
    const userName = "Vicente";

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = () => {
        fetch(`${baseUrl}/users/${userName}`)
            .then((resp) => {
                if (resp.status === 404) return createUser();
                if (!resp.ok) throw Error("Error al obtener tareas");
                return resp.json();
            })
            .then((data) => {
                if (data && data.todos) setTasks(data.todos);
            })
            .catch((error) => console.error(error));
    };

    const createUser = () => {
        fetch(`${baseUrl}/users/${userName}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        })
            .then((resp) => { if (resp.ok) getTasks(); })
            .catch((error) => console.error("Error al crear usuario ", error));
    };

    const addTask = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const newTask = { label: inputValue.trim(), is_done: false };
            fetch(`${baseUrl}/todos/${userName}`, {
                method: "POST",
                body: JSON.stringify(newTask),
                headers: { "Content-Type": "application/json" }
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setTasks([...tasks, data]);
                    setInputValue("");
                })
                .catch((error) => console.error("Error al agregar tarea: ", error));
        }
    };

    const deleteTask = (id) => {
        fetch(`${baseUrl}/todos/${id}`, { method: "DELETE" })
            .then((resp) => {
                if (resp.ok) {
                    setTasks(tasks.filter((task) => task.id !== id));
                }
            })
            .catch((error) => console.error("Error al borrar tarea:", error));
    };

    const deleteAllTask = () => {
        fetch(`${baseUrl}/users/${userName}`, { method: "DELETE" })
            .then((resp) => {
                if (resp.ok) {
                    setTasks([]);
                    createUser();
                }
            })
            .catch((error) => console.error("Error al borrar tareas:", error));
    };

    return (
        <div className="container">
            <h1 className="mb-4 text-center">To-do List</h1>
            <div className="input-group mb-4">
                <input
                    type="text"
                    className="inputuno form-control mx-5 py-2"
                    placeholder="Ingresa una tarea!"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={addTask}
                />
            </div>
            {/* Lista de tareas */}
            {tasks.length > 0 && (
                <ul className="list-group lista mx-5 shadow">
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className="list-group-item d-flex justify-content-between align-items-center task-item"
                        >
                            <span>{task.label}</span>
                            <span
                                className="delete-icon"
                                onClick={() => deleteTask(task.id)}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Nueva sección: Contador y Botón al mismo nivel */}
            <div className="d-flex justify-content-between align-items-center mx-5 mt-2">
                <small className="text-white-50 mb-3 ms-2">
                    {tasks.length === 0
                        ? "No hay tareas pendientes"
                        : `${tasks.length} ${tasks.length === 1 ? "tarea restante" : "tareas restantes"}`
                    }
                </small>

                <button
                    type="button"
                    className="btn btn-danger"
                    onClick={deleteAllTask}
                >
                    Eliminar Todo
                </button>
            </div>
        </div>
    );
};

export default TodoList;