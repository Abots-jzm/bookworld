import React from "react";
import styled from "styled-components";
import heroImg from "../assets/hero.jpg";

interface Props {}

const Home = (props: Props) => {
	return (
		<Container>
			<Layout>
				<BackgroundOverlay>
					<LeftWrapper>
						<Logo>
							BOOK<span>World</span>
						</Logo>
						<Copy main>The world's books</Copy>
						<Copy>at your fingertips</Copy>
						<Search>
							<SearchInput type="text" placeholder="search over 10 million books" />
							<SearchBtn type="submit">
								<span className="material-symbols-outlined">search</span>
							</SearchBtn>
						</Search>
					</LeftWrapper>
				</BackgroundOverlay>
				<HeroImage />
			</Layout>
		</Container>
	);
};

export default Home;

const Logo = styled.div`
	font-weight: 100;
	margin-top: 5vh;
	font-size: 3.2rem;

	span {
		color: orangered;
	}

	@media only screen and (max-width: 600px) {
		font-size: 2.4rem;
	}
`;

const Container = styled.header`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100vw;
	height: 100vh;
	background-image: linear-gradient(to bottom, #c3c2c0, #c7c6c4);
	background-size: contain;
	overflow-x: hidden;
`;

const Layout = styled.div`
	width: 100%;
	height: 100%;
	position: relative;
`;

const BackgroundOverlay = styled.div`
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 1;
	background-image: linear-gradient(to bottom right, black, rgba(0, 0, 0, 0.5));
`;

const LeftWrapper = styled.div`
	margin-left: 7rem;
	position: relative;
	z-index: 2;
	width: min(100%, 70rem);
	color: white;

	@media only screen and (max-width: 600px) {
		margin-left: 1rem;
	}
`;

const HeroImage = styled.div`
	background-image: url(${heroImg});
	background-size: cover;
	background-position: -20rem;
	position: absolute;
	width: 50%;
	right: 0;
	top: 0;
	bottom: 0;
`;

interface ICopy {
	main?: boolean;
}

const Copy = styled.div<ICopy>`
	font-size: ${(props) => (props.main ? "7.2rem" : "5.2rem")};
	font-weight: ${(props) => (props.main ? "700" : "100")};
	margin-top: ${(props) => (props.main ? "15rem" : "0")};

	@media only screen and (max-width: 600px) {
		margin-top: ${(props) => (props.main ? "7rem" : "1rem")};
		font-size: ${(props) => (props.main ? "5.8rem" : "3.2rem")};
	}
`;

const Search = styled.form`
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
