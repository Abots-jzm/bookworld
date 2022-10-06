import React from "react";
import styled from "styled-components";

interface Props {
	totalItems: number;
	currentPage: number;
	itemsPerPage: number;
	siblingCount: number;
	onNextPage: () => void;
	onPrevPage: () => void;
	onSelectedPage: (page: number) => void;
}

const Pagination = ({ totalItems, itemsPerPage, currentPage, siblingCount, onNextPage, onPrevPage, onSelectedPage }: Props) => {
	const lastPage = Math.ceil(totalItems / itemsPerPage);
	const numbersArray = [currentPage];

	for (let i = 1; i < siblingCount + 1; i++) {
		const nextNumber = currentPage + i;

		if (nextNumber < lastPage) numbersArray.push(nextNumber);
	}

	for (let i = 1; i < siblingCount + 1; i++) {
		const nextNumber = currentPage - i;

		if (nextNumber > 0) numbersArray.unshift(nextNumber);
	}

	return (
		<>
			<PaginationButton isActivePage={false} onClick={onPrevPage}>
				<span className="material-symbols-outlined">navigate_before</span>
			</PaginationButton>
			{React.Children.toArray(
				numbersArray.map((number) => (
					<PaginationButton isActivePage={number === currentPage} onClick={onSelectedPage.bind(null, number)}>
						<span>{number}</span>
					</PaginationButton>
				))
			)}
			<Ellipsis>.....</Ellipsis>
			<PaginationButton isActivePage={false} onClick={onNextPage}>
				<span className="material-symbols-outlined">navigate_next</span>
			</PaginationButton>
		</>
	);
};

export default React.memo(Pagination);

const Ellipsis = styled.div`
	font-weight: 700;
	align-self: flex-end;
`;

interface IPaginationButton {
	isActivePage: boolean;
}

const PaginationButton = styled.button<IPaginationButton>`
	flex: 1;
	height: 3rem;
	box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
	outline: none;
	border: 1px solid #ccc;
	background-color: ${(props) => (props.isActivePage ? "#d31300" : "white")};
	color: ${(props) => (props.isActivePage ? "#f8f9fa" : "black")};
	display: flex;
	justify-content: center;
	align-items: center;
	transform: skew(-15deg);
	font: inherit;
	transition: background-color 0.2s, color 0.2s;

	span {
		transform: skew(15deg);
		font-weight: 700;
	}

	@media (hover: hover) {
		cursor: pointer;

		&:hover {
			background-color: #d31300;
			color: #f8f9fa;
		}
	}
`;
