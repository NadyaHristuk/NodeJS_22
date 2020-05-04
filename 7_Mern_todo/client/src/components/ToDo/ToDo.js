import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { input } from '../../actions/inputAction';
import { deleteTask, editTask, isActive } from '../../actions/tasksAction';
import { read, change } from '../../actions/editFieldAction';
import Button from '../Button/Button';
import './ToDo.css';

class ToDo extends Component {
	deleteTask = ({ target }) => {
		let id = target.closest('.task').id;
		axios.delete(`http://localhost:3001/tasks/${id}`).then(({ status }) => {
			if (status === 200) {
				this.props.delete(id);
			}
		});
	};

	editTask = () => {
		axios
			.put(`http://localhost:3001/tasks/${this.props.id}`, { task: this.props.editField })
			.then(({ status, data }) => {
				if (status === 200) {
					this.props.edit(this.props.id, data.task);
					this.update();
				}
			});
	};

	update = () => {
		this.props.isActiveToggle(this.props.id);
	};

	readValue = () => {
		this.props.read(this.props.text);
		this.update();
	};

	changeValue = (e) => {
		this.props.change(e.target.value);
	};

	render() {
		return this.props.isActive ? (
			<li className="task" id={this.props.id}>
				<input
					className="input"
					onChange={this.changeValue}
					type="text"
					value={this.props.editField}
					name="input"
				/>
				<div>
					<Button onClick={this.editTask} text="Save" />
					<Button onClick={this.update} text="Cancel" />
				</div>
			</li>
		) : (
			<li className="task" id={this.props.id}>
				{this.props.text}
				<div>
					<Button onClick={this.readValue} text="Edit" />
					<Button onClick={this.deleteTask} text="Delete" />
				</div>
			</li>
		);
	}
}

function mapStateToProps(state) {
	return {
		editField: state.editField
	};
}

function mapDispatchToProps(dispatch) {
	return {
		delete: function(id) {
			dispatch(deleteTask(id));
		},
		edit: function(id, input) {
			dispatch(editTask(id, input));
		},
		isActiveToggle: function(id) {
			dispatch(isActive(id));
		},
		read: function(text) {
			dispatch(read(text));
		},
		change: function(text) {
			dispatch(change(text));
		}
	};
}
export default connect(mapStateToProps, mapDispatchToProps)(ToDo);
