import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "react-query";

interface Props {
	query?: string;
}

async function getSearchResults(queryParams: string) {
	if (!queryParams) return "no books available";

	const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${queryParams}&key=${process.env.REACT_APP_API_KEY}`);
	return await res.json();
}

const Search = ({ query }: Props) => {
	const [searchParams, setSearchParams] = useSearchParams(query ? { q: query } : {});
	const [enteredSearch, setEnteredSearch] = useState("");
	const queryParam = searchParams.get("q") || "";
	const { data, isFetching, isError } = useQuery(["search", queryParam], getSearchResults.bind(null, queryParam));
	console.log(data, isFetching, isError);

	function onFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSearchParams({ q: enteredSearch });
		setEnteredSearch("");
	}

	return (
		<div>
			<SearchPanel onSubmit={onFormSubmit}>
				<SearchInput type="text" placeholder="search over 10 million books" onChange={(e) => setEnteredSearch(e.target.value)} value={enteredSearch} required />
				<SearchBtn type="submit">
					<span className="material-symbols-outlined">search</span>
				</SearchBtn>
			</SearchPanel>
		</div>
	);
};

export default Search;

const SearchPanel = styled.form`
	margin-top: 7rem;
	display: flex;
	width: 85%;
`;

const SearchInput = styled.input`
	flex: 1;
	padding: 1rem;
	border: none;
	outline: none;
	font: inherit;
	font-weight: 600;

	&::placeholder {
		font-weight: 400;
	}

	&:focus {
		outline: none;
	}
`;

const SearchBtn = styled.button`
	flex: 0 0;
	background-color: #d31300;
	color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.5rem 1.5rem;
	outline: none;
	border: none;

	@media only screen and (hover: hover) {
		:hover {
			cursor: pointer;
			background-color: #c11e10;
		}
	}
`;
