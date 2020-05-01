import React from 'react';
import './Search.css';

const Search = ({ getInput }) => (
	<form className="search" onSubmit={getInput}>
		<input type="text" name="city" placeholder="Enter the title" />
		<input type="submit" value="Submit" />
	</form>
);

export default Search;
