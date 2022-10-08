import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import BookItem from "../components/BookItem";
import { useQuery } from "react-query";
import Pagination from "../components/Pagination";
import BookDetails from "../components/BookDetails";
import SkeletonLoader from "../ui/SkeletonLoader";

async function getSearchResults(queryParams: string, pageNumber: number) {
	const startIndex = (pageNumber - 1) * 10;
	const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${queryParams}&startIndex=${startIndex}&key=${process.env.REACT_APP_API_KEY}`);
	return await res.json();
}

const Search = () => {
	const navigate = useNavigate();

	const [searchParams, setSearchParams] = useSearchParams();
	const [enteredSearch, setEnteredSearch] = useState("");
	const [queryParam, setQueryParam] = useState("");
	const [pageNumber, setPageNumber] = useState(1);
	const [detailShown, setDetailShown] = useState(false);
	const [currentDetailsId, setCurrentDetailsId] = useState<string>();

	useEffect(() => {
		const query = searchParams.get("q");
		const pageNo = searchParams.get("page");
		if (!query || !pageNo) navigate("/");
		else {
			setQueryParam(query);
			setPageNumber(+pageNo);
		}
	}, [navigate, searchParams]);

	let totalItems;
	const { data, isError, isLoading } = useQuery(["search", queryParam, pageNumber], () => getSearchResults(queryParam, pageNumber), {
		refetchOnWindowFocus: false,
		enabled: !!queryParam && !!pageNumber,
		select(data) {
			totalItems = data.totalItems;
			return data.items.map((item: any) => {
				return {
					id: item.id,
					title: item.volumeInfo.title,
					authors: item.volumeInfo?.authors || [],
					year: item.volumeInfo?.publishedDate?.slice(0, 4) || "unknown",
					thumbnail: item.volumeInfo?.imageLinks?.thumbnail || "",
					categories: item.volumeInfo.categories,
				};
			});
		},
	});

	function onFormSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSearchParams({ q: enteredSearch, page: "1" });
		setPageNumber(1);
		setDetailShown(false);
	}

	function nextPage() {
		const pageNo = pageNumber + 1;
		setPageNumber(pageNo);
		setSearchParams({ q: queryParam, page: pageNo.toString() });
		setDetailShown(false);
	}

	function prevPage() {
		const pageNo = pageNumber - 1;
		setPageNumber(pageNo);
		setSearchParams({ q: queryParam, page: pageNo.toString() });
		setDetailShown(false);
	}

	function selectedPage(pageNo: number) {
		setPageNumber(pageNo);
		setSearchParams({ q: queryParam, page: pageNo.toString() });
		setDetailShown(false);
	}

	function showDetails(id: string) {
		setCurrentDetailsId(id);
		setDetailShown(true);
	}

	return (
		<Layout>
			<SearchPanel onSubmit={onFormSubmit}>
				<SearchInput type="text" placeholder="search over 10 million books" onChange={(e) => setEnteredSearch(e.target.value)} value={enteredSearch} required />
				<SearchBtn type="submit">
					<span className="material-symbols-outlined">search</span>
				</SearchBtn>
			</SearchPanel>
			<ResultsContainer>
				{detailShown && currentDetailsId && <BookDetails hideDetails={() => setDetailShown(false)} bookId={currentDetailsId} />}
				<SearchResults>
					{isLoading && (
						<BooksGrid>
							<SkeletonLoader count={10} />
						</BooksGrid>
					)}
					{isError && <ErrorMessage>An error occurred. Please Try again another time</ErrorMessage>}
					{!isLoading && !isError && data && (
						<>
							<BooksGrid>
								{data.map((item: any) => (
									<BookItem key={item.id} {...item} showDetails={showDetails} />
								))}
							</BooksGrid>
							<PaginationContainer>
								<Pagination
									onNextPage={nextPage}
									onPrevPage={prevPage}
									onSelectedPage={selectedPage}
									totalItems={totalItems || 0}
									currentPage={pageNumber}
									itemsPerPage={10}
									siblingCount={2}
								/>
							</PaginationContainer>
						</>
					)}
				</SearchResults>
			</ResultsContainer>
		</Layout>
	);
};

export default Search;

const SearchResults = styled.div`
	flex: 1;
`;

const ResultsContainer = styled.div`
	display: flex;
	flex-direction: row-reverse;
	flex-wrap: wrap;
	gap: 2rem;
	justify-content: center;
`;

const PaginationContainer = styled.div`
	max-width: 40rem;
	align-self: center;
	display: flex;
	gap: 1rem;
	margin: 5rem auto 7rem;
`;

const ErrorMessage = styled.p`
	margin: 7rem auto 0;
	text-align: center;
`;

const BooksGrid = styled.div`
	margin: 5vh 0;
	width: 100%;
	display: grid;
	justify-content: center;
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
