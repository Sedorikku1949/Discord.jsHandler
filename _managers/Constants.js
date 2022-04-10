const ResponseType = {
	1: "REPLY",
	2: "SEND"
}

const EphemeralType= {
	1: "SEND_EPHEMERAL",
	2: "SEND_CLASSIC",
	SEND_EPHEMERAL: 1,
	SEND_CLASSIC: 2
}

module.exports = {
	ResponseType,
	EphemeralType
}