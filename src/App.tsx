import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

function App() {
	return (
		<Routes>
			<Route path="/">
				<Route index element={<Home />} />
			</Route>
		</Routes>
	);
}

export default App;
