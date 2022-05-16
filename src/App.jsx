import React, { useState } from "react";
import "./app.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import Header from "./components/Header";
import Prompt from "./components/Prompt";
import TweetsResult from "./components/TweetsResult";

function App() {
	const [emotion, setEmotion] = useState("");
	const [person, setPerson] = useState("");
	const [tweets, setTweets] = useState([]);

	const submitHandler = async (e) => {
		e.preventDefault();
		const prompt = `Write a ${emotion} tweet about ${person}`;
		const config = {
			prompt: prompt,
			temperature: 0.5,
			max_tokens: 32,
			top_p: 1.0,
			frequency_penalty: 0.0,
			presence_penalty: 0.0,
		};

		const res = await fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
			},
			body: JSON.stringify(config),
		});

		const data = await res.json();
		setTweets((prev) => [[prompt, data.choices[0].text], ...prev]);
		setEmotion("");
		setPerson("");
	};

	return (
		<div className="App">
			<Header />
			<div className="main-container">
				<Prompt
					submitHandler={submitHandler}
					emotion={emotion}
					person={person}
					setEmotion={(value) => setEmotion(value)}
					setPerson={(value) => setPerson(value)}
				/>

				<div className="tweets-container">
					<h2>Tweets Generated:</h2>
					{tweets.map((tweet) => (
						<TweetsResult tweet={tweet} />
					))}
				</div>
			</div>
		</div>
	);
}

export default App;
