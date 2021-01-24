/*
	IDeNtification Api

	Listens for requests on basic identification endpoints
*/

import express from "express";

export default (app: express.Application) => {
	app.get("/_matrix/client/versions", (req, res) => {
		res.status(200).send({
			versions: [
				"r0.6.1"
			],
			unstable_features: {}
		})
	})
}