import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { input, inputCleaner } from './actions/inputAction';
import { loadTasks, addTask } from './actions/tasksAction';

import './App.css';
import ToDoList from './components/ToDoList/ToDoList';

class App extends Component {
	componentDidMount() {
		axios.get('http://localhost:3001/tasks').then(({ data, status }) => {
			if (status === 200) {
				this.props.loadTasks(data);
			}
		});
	}

	addInput = (event) => {
		event.preventDefault();
		let newInput = this.props.input;
		axios.post('http://localhost:3001/tasks', { task: newInput }).then(({ data, status }) => {
			if (status === 201) {
				this.props.inputAddTask(data);
			}
		});
	};

	inputHandler = (event) => {
		this.addInput(event);
		this.props.inputCleaner();
	};

	render() {
		return (
			<div className="container">
				<div className="container__form">
					<h1 className="header">ToDo List</h1>
					<form onSubmit={this.inputHandler}>
						<input
							className="input"
							onChange={this.props.inputChanges}
							type="text"
							name="input"
							value={this.props.input}
						/>
						<button className="container__btn" type="submit">
							Create
						</button>
					</form>
				</div>
				<ToDoList />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		input: state.input,
		inputsArr: state.inputsArr
	};
}

function mapDispatchToProps(dispatch) {
	return {
		inputChanges: function({ target }) {
			dispatch(input(target.value));
		},
		inputAddTask: function(value) {
			dispatch(addTask(value));
		},
		inputCleaner: function() {
			dispatch(inputCleaner());
		},
		loadTasks: function(data) {
			dispatch(loadTasks(data));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
