import React from "react";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Props {
	count: number;
}

const SkeletonLoader = ({ count }: Props) => {
	return (
		<>
			{Array(count)
				.fill(0)
				.map((_, i) => (
					<Container key={i}>
						<Left>
							<Skeleton height={"100%"} />
						</Left>
						<Right>
							<div>
								<Skeleton count={2} />
							</div>
							<Name>
								<Skeleton />
							</Name>
							<Date>
								<Skeleton />
							</Date>
							<Last>
								<Skeleton />
							</Last>
						</Right>
					</Container>
				))}
		</>
	);
};

export default SkeletonLoader;

const Name = styled.div`
	width: 80%;
`;

const Date = styled.div`
	width: 40%;
`;

const Last = styled.div`
	margin-top: auto;
	width: 90%;
`;

const Container = styled.div`
	display: flex;
	box-shadow: rgba(149, 157, 165, 0.2) 0 8px 24px;
	border-radius: 3px;
	gap: 2rem;
	padding: 3rem;
`;

const Left = styled.div`
	flex: 1;
	height: 15rem;
	width: 10rem;
`;

const Right = styled.div`
	flex: 2;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;
