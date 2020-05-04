const { Router } = require('express');
const router = Router();
const ctrlTodo = require('../controllers/todo_controllers');

router.get('/', ctrlTodo.getTasks);

router.get('/:id', ctrlTodo.getTask);

router.post('/', ctrlTodo.addTask);

router.put('/:id', ctrlTodo.editTask);

router.delete('/:id', ctrlTodo.deleteTask);

module.exports = router;
