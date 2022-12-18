module.exports = (username) => {
	return /^(?=.{3,20}$)(?![_.])[a-zA-Z0-9._]+(?<![_.])$/.test(username);
	//       └─────┬────┘└───┬──┘└─────┬─────┘ └───┬───┘
	//             │         │         │           no _ or . at the end
	//             │         │         │
	//             │         │         allowed characters
	//             │         │
	//             │         no _ or . at the beginning
	//             │
	//             username is 3-20 characters long
};
