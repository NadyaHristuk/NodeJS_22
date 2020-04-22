import React from 'react';
import './Search.css';

const Search = ({ getInput }) => (
	<form className="search" onSubmit={getInput}>
		<input type="text" name="city" />
		<input type="submit" />
	</form>
);

export default Search;
