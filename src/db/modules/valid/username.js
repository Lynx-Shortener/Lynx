module.exports = (username) => {
	return /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(username);
	//       └─────┬────┘└───┬──┘└─────┬─────┘└─────┬─────┘ └───┬───┘
	//             │         │         │            │           no _ or . at the end
	//             │         │         │            │
	//             │         │         │            allowed characters
	//             │         │         │
	//             │         │         no __ or _. or ._ or .. inside
	//             │         │
	//             │         no _ or . at the beginning
	//             │
	//             username is 3-20 characters long
};
