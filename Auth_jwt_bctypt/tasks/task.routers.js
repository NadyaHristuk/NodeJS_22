const { Router } = require('express');
const toDoRouter = Router();

const ctrlTodo = require('./task.controllers');

toDoRouter.get('/', ctrlTodo.getTasks);

toDoRouter.get('/:id', ctrlTodo.getTask);

toDoRouter.post('/', ctrlTodo.addTask);

toDoRouter.put('/:id', ctrlTodo.editTask);

toDoRouter.delete('/:id', ctrlTodo.deleteTask);

module.exports = toDoRouter;
