import React from 'react';
import logo from './logo.svg';
import './App.css';

function App(props) {
	const uploadFile = async e => {
		const files = e.target.files
		console.log('files', files)
		const form = new FormData()
		for (let i = 0; i < files.length; i++) {
		  form.append('avatar', files[i], files[i].name)
		}
		try {
		  let request = await fetch('/upload', {
			method: 'post',
			body: form,
		  })
		  const response = await request.json()
		  console.log('Response', response)
		} catch (err) {
		  alert('Error uploading the files')
		  console.log('Error uploading the files', err)
		}
	  }

	return (
		<div className="App">
			<h1>File upload</h1>
			<input type="file" multiple onChange={(e) => uploadFile(e)} />
		</div>
	);
}

export default App;
