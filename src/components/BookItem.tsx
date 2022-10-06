import React from "react";
import styled from "styled-components";

function truncateTxt(value: string, length: number) {
	return value.length > length ? `${value.substring(0, length)}...` : value;
}

function getAuthorsText(authors: string[]) {
	if (authors.length === 0) return "unknown";
	if (authors.length === 1) return authors[0];
	else {
		const last = authors.pop();
		return authors.join(", ") + " and " + last;
	}
}

interface Props {
	thumbnail: string;
	title: string;
	authors: string[];
	year: string;
	categories?: string[];
}

const BookItem = ({ thumbnail, title, authors, year, categories }: Props) => {
	return (
		<Container>
			<Image thumbnail={thumbnail || ""} />
			<Details>
				<Title>{truncateTxt(title, 27)}</Title>
				<p>{getAuthorsText(authors)}</p>
				<Year>{year}</Year>
				<Categories>{categories && categories.map((category) => <Category key={category}>{category}</Category>)}</Categories>
			</Details>
		</Container>
	);
};

export default BookItem;

const Category = styled.div`
	align-self: flex-start;
	padding: 0.2rem 1rem;
	font-size: 1.2rem;
	background-color: rgba(197, 0, 211, 0.1);
	border-radius: 1000rem;
	border: 1px solid #c500d3;
	max-width: 15rem;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const Year = styled.div`
	font-weight: 700;
	font-size: 1.2rem;
`;

const Categories = styled.div`
	margin-top: auto;
	display: flex;
	flex-wrap: wrap;
	font-size: 1.2rem;
	gap: 1rem;
`;

const Title = styled.h3`
	font-size: 1.8rem;
`;

const Details = styled.div`
	flex: 2;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const Container = styled.div`
	display: flex;
	box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
	gap: 2rem;
	padding: 3rem;
`;

interface IImage {
	thumbnail: string;
}

const Image = styled.div<IImage>`
	flex: 1;
	height: 15rem;
	width: 10rem;
	background-image: ${({ thumbnail }) => (thumbnail ? `url("${thumbnail}")` : `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.8))`)};
	background-position: center;
	background-size: contain;
	background-repeat: no-repeat;
	color: white;
`;
