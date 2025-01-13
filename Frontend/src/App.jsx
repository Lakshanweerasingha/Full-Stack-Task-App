import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Form, Button, ListGroup, Alert, Spinner, Modal } from 'react-bootstrap';

const App = () => {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentTodo, setCurrentTodo] = useState({});

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/todos');
            if (Array.isArray(response.data)) {
                setTodos(response.data);
            } else {
                throw new Error('Invalid response format');
            }
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch todos.');
            setLoading(false);
        }
    };

    const addTodo = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/todos', { title });
            if (response.data && response.data.id) {
                setTodos([...todos, response.data]);
                setTitle('');
                setSuccess('Todo added successfully!');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError('Failed to add todo.');
        }
    };

    const handleUpdateClick = (todo) => {
        setCurrentTodo(todo);
        setShowModal(true);
    };

    const handleUpdateSubmit = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/todos/${currentTodo.id}`, { title: currentTodo.title });
            if (response.data && response.data.id) {
                setTodos(todos.map(todo => (todo.id === currentTodo.id ? response.data : todo)));
                setSuccess('Todo updated successfully!');
                setShowModal(false);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            setError('Failed to update todo.');
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/todos/${id}`);
            setTodos(todos.filter(todo => todo.id !== id));
            setSuccess('Todo deleted successfully!');
        } catch (error) {
            setError('Failed to delete todo.');
        }
    };

    const handleModalChange = (e) => {
        setCurrentTodo({
            ...currentTodo,
            title: e.target.value
        });
    };

    return (
        <Container className="mt-5">
            <h1>Todo List</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={(e) => { e.preventDefault(); addTodo(); }}>
                <Form.Group>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter todo"
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="mt-2">Add Todo</Button>
            </Form>
            {loading ? (
                <Spinner animation="border" role="status" className="mt-3">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                <ListGroup className="mt-3">
                    {Array.isArray(todos) && todos.map(todo => (
                        <ListGroup.Item key={todo.id}>
                            {todo.title}
                            <Button variant="info" onClick={() => handleUpdateClick(todo)} className="float-right ml-2">Update</Button>
                            <Button variant="danger" onClick={() => deleteTodo(todo.id)} className="float-right">Delete</Button>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Todo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentTodo.title}
                                onChange={handleModalChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdateSubmit}>Update Todo</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default App;
