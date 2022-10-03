import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";

function App() {
	const [searchString, setSearchString] = useState("");

	function search(query: string) {
		setSearchString(query);
	}

	return (
		<Routes>
			<Route path="/">
				<Route index element={<Home onSearch={search} />} />
				<Route path="search" element={<Search query={searchString} />} />
			</Route>
		</Routes>
	);
}

export default App;
