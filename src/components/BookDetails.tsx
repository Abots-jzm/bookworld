import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useQuery } from "react-query";

async function fetchBookDetails(bookId: string) {
	const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.REACT_APP_API_KEY}`);
	return await res.json();
}

function getAuthorsText(authors: string[]) {
	if (authors.length === 0) return "unknown";
	if (authors.length === 1) return authors[0];
	else {
		const last = authors.pop();
		return authors.join(", ") + " and " + last;
	}
}

function truncateTxt(value: string, length: number) {
	return value.length > length ? `${value.substring(0, length)}...` : value;
}

interface Props {
	bookId: string;
	hideDetails: () => void;
}

const BookDetails = ({ bookId, hideDetails }: Props) => {
	const [shownMore, setShownMore] = useState(false);

	const { data, isLoading, isError } = useQuery(["details", bookId], fetchBookDetails.bind(null, bookId), {
		refetchOnWindowFocus: false,
		select(data) {
			return {
				title: data.volumeInfo.title,
				authors: data.volumeInfo?.authors || [],
				pageCount: data.volumeInfo?.pageCount,
				rating: data.volumeInfo?.averageRating,
				date: data.volumeInfo?.publishedDate || "unknown date",
				description: data.volumeInfo.description,
				thumbnail: data.volumeInfo?.imageLinks?.medium || data.volumeInfo?.imageLinks?.small || data.volumeInfo?.imageLinks?.thumbnail || "",
				categories: data.volumeInfo?.categories || ["unknown"],
				link: data.volumeInfo?.previewLink,
			};
		},
	});

	if (isLoading)
		return (
			<DetailsContainer>
				<EllipsisSpinner>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</EllipsisSpinner>
			</DetailsContainer>
		);

	if (isError) return <DetailsContainer style={{ textAlign: "center" }}>An Error occurred</DetailsContainer>;

	return (
		<DetailsContainer thumbnail={data?.thumbnail}>
			<Close onClick={hideDetails}>
				<span className="material-symbols-outlined">close</span>
			</Close>
			<OtherContainer>
				<Title>{data?.title}</Title>
				<Authors>{getAuthorsText(data?.authors)}</Authors>
				<Description>
					<DescriptionParagraph isShownMore={shownMore} dangerouslySetInnerHTML={{ __html: data?.description }} />
					{data?.description && <ShowOrHide onClick={() => setShownMore((prevState) => !prevState)}>{shownMore ? "show less" : "show more"}</ShowOrHide>}
				</Description>
				<OtherDetails>
					<p>{truncateTxt(data?.categories[0], 35)}</p>
					<p>{data?.date}</p>
					<p>{data?.rating ? data?.rating + " / 5" : "unknown rating"}</p>
					<p>{data?.pageCount ? data.pageCount.toLocaleString() + " pages" : ""}</p>
				</OtherDetails>
				<FindOutMore href={data?.link} target="_blank">
					Find out more
				</FindOutMore>
			</OtherContainer>
		</DetailsContainer>
	);
};

export default BookDetails;

const Close = styled.div`
	position: sticky;
	top: 2rem;
	margin-left: 28rem;
	color: #f8f9fa;

	@media (hover: hover) {
		cursor: pointer;
	}
`;

const FindOutMore = styled.a`
	&,
	&:link,
	&:visited {
		color: #f8f9fa;
		text-decoration: none;
		margin: 2rem auto;
		background-color: #d31300;
		padding: 1rem 3rem;
		border-radius: 3px;
		text-align: center;
		align-self: stretch;

		transition: background-color 0.2s;
	}

	@media (hover: hover) {
		&:hover {
			background-color: #9e0d00;
		}
	}
`;

const OtherDetails = styled.div`
	margin: 3rem 0;
	display: grid;
	gap: 2rem;
	grid-template-columns: repeat(2, 1fr);

	p {
		color: #aaa;
		font-size: 1.4rem;
	}
`;

const Authors = styled.p`
	margin-top: 1rem;
	color: #aaa;
`;

const ShowOrHide = styled.p`
	position: absolute;
	color: #259ef4;
	font-weight: bold;
	right: 0;
	bottom: -2rem;

	@media (hover: hover) {
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}
	}
`;

interface IDescriptionParagraph {
	isShownMore: boolean;
}

const DescriptionParagraph = styled.p<IDescriptionParagraph>`
	font-size: 1.6rem;
	letter-spacing: 1.4px;
	line-height: 1.5;
	max-height: ${(props) => (props.isShownMore ? "max-content" : "17rem")};
	overflow: ${(props) => (props.isShownMore ? "visible" : "hidden")};
	text-overflow: ellipsis;
`;

const Description = styled.div`
	position: relative;
	margin: 2rem 0;
`;

const Title = styled.h3`
	font-size: 2.4rem;
`;

const OtherContainer = styled.div`
	background-color: #222;
	margin-top: 70vh;
	padding: 1.6rem;
	color: #f8f9fa;
	display: flex;
	flex-direction: column;
`;

interface IDetailsContainer {
	thumbnail?: string;
}

const DetailsContainer = styled.div<IDetailsContainer>`
	background-color: #222;
	background-image: ${({ thumbnail }) => (thumbnail ? `url("${thumbnail}")` : `linear-gradient(to bottom, rgba(0,0,0,0.5), #222)`)};
	background-repeat: no-repeat;
	background-position: top;
	background-size: contain;
	border-radius: 3px;
	box-shadow: rgba(149, 157, 165, 1) 0 8px 24px;
	flex: 0 0 32rem;
	color: white;
	margin-top: 5vh;
	height: 90vh;
	position: sticky;
	top: 5vh;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 5px;
	}

	&::-webkit-scrollbar-track {
		background-color: #ccc;
	}

	&::-webkit-scrollbar-thumb {
		background: #555;
		border-radius: 100rem;
	}

	@media only screen and (max-width: 716px) {
		position: static;
	}
`;

//Loading Animation and spinner

const ldsEllipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const ldsEllipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

const ldsEllipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(24px, 0);
  }
`;

const EllipsisSpinner = styled.div`
	margin: 10vh 12rem;
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;

	div {
		position: absolute;
		top: 33px;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: currentColor;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}

	div:nth-child(1) {
		left: 8px;
		animation: ${ldsEllipsis1} 0.6s infinite;
	}

	div:nth-child(2) {
		left: 8px;
		animation: ${ldsEllipsis2} 0.6s infinite;
	}

	div:nth-child(3) {
		left: 32px;
		animation: ${ldsEllipsis2} 0.6s infinite;
	}

	div:nth-child(4) {
		left: 56px;
		animation: ${ldsEllipsis3} 0.6s infinite;
	}
`;
