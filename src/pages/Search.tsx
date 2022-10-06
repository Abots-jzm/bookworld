import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import BookItem from "../components/BookItem";
import { useQuery } from "react-query";

interface Props {
	query?: string;
}

async function getSearchResults(queryParams: string, pageNumber: number) {
	if (!queryParams) return "no books available";

	const startIndex = (pageNumber - 1) * 10;
	const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${queryParams}&startIndex=${startIndex}&key=${process.env.REACT_APP_API_KEY}`);
	return await res.json();
}

const Search = ({ query }: Props) => {
	const [searchParams, setSearchParams] = useSearchParams(query ? { q: query, page: "1" } : { q: "", page: "1" });

	const [enteredSearch, setEnteredSearch] = useState("");

	const queryParam = searchParams.get("q") || "";
	let pageNumber = +searchParams.get("page")! || 1;

	const { data, isError, isLoading } = useQuery(["search", queryParam, pageNumber], getSearchResults.bind(null, queryParam, pageNumber), {
		refetchOnWindowFocus: false,
		select(data) {
			return data.items.map((item: any) => {
				return {
					id: item.id,
					title: item.volumeInfo.title,
					authors: item.volumeInfo?.authors || [],
					year: item.volumeInfo?.publishedDate?.slice(0, 4) || "unknown",
					description: item.volumeInfo.description,
					thumbnail: item.volumeInfo?.imageLinks?.thumbnail || "",
					categories: item.volumeInfo.categories,
				};
			});
		},
	});

	function onFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSearchParams({ q: enteredSearch, page: pageNumber.toString() });
	}

	function nextPage() {
		pageNumber++;
		setSearchParams({ q: queryParam, page: pageNumber.toString() });
	}

	function prevPage() {
		pageNumber--;
		setSearchParams({ q: queryParam, page: pageNumber.toString() });
	}

	return (
		<Layout>
			<SearchPanel onSubmit={onFormSubmit}>
				<SearchInput type="text" placeholder="search over 10 million books" onChange={(e) => setEnteredSearch(e.target.value)} value={enteredSearch} required />
				<SearchBtn type="submit">
					<span className="material-symbols-outlined">search</span>
				</SearchBtn>
			</SearchPanel>
			{isLoading && <Spinner />}
			{isError && <ErrorMessage>An error occurred. Please Try again another time</ErrorMessage>}
			{!isLoading && !isError && (
				<BooksGrid>
					{data.map((item: any) => (
						<BookItem key={item.id} {...item} />
					))}
					{/*<PaginationContainer>yo</PaginationContainer>*/}
				</BooksGrid>
			)}
		</Layout>
	);
};

export default Search;

const PaginationButton = styled.div``;

const PaginationContainer = styled.div`
	width: 100%;
	align-self: center;
	background-color: red;
	display: flex;
	justify-content: space-between;
`;

const ErrorMessage = styled.p`
	margin: 7rem auto 0;
	text-align: center;
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
	animation: ${rotate360} 1s ease-in-out infinite;
	margin: 10rem auto auto;

	border-left: 3px solid #aaa;
	border-right: 3px solid #aaa;
	border-bottom: 3px solid #aaa;
	border-top: 3px solid black;
	background: transparent;
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
`;

const BooksGrid = styled.div`
	margin: 5vh 0;
	width: 100%;
	display: grid;
	justify-content: center;
	justify-items: center;
	grid-template-columns: repeat(auto-fit, minmax(32rem, 1fr));
	gap: 2rem;
`;

const Layout = styled.div`
	margin: 0 auto;
	max-width: 140rem;
	padding: 0 2rem;
`;

const SearchPanel = styled.form`
	margin-top: 3rem;
	margin-inline: auto;
	display: flex;
	max-width: 80rem;
	width: 85%;
`;

const SearchInput = styled.input`
	flex: 1;
	padding: 1rem;
	border: 1px solid #d31300;
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
