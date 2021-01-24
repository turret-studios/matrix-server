import * as express from "express";
import colors from "colors";
import * as fs from "fs";
import * as https from "https";
import * as crypto from "crypto";
import YAML from "yaml";

const configVersion = 1
global.version = "build 0"

colors.setTheme({
    success: ["green"],
    error: ["white", "bgRed", "bold"],
    warn: ["yellow"],
    audit: ["white", "bgBlue"],
});

declare global {
	var CFG: any;
	var version: any;
}

declare global {
	interface String {
		success: string,
		error: string,
		warn: string,
		audit: string
	}
}

try {
	global.CFG = YAML.parse(fs.readFileSync(`${__dirname}/../config.yml`).toString())
} catch(e) {
	console.error("[matrix-server.main] FATAL ERROR: config failed to load".error)
	process.exit()
}

if(Math.floor(global.CFG.configVersion) < Math.floor(configVersion)){
	console.error(`[matrix-server.main] FATAL ERROR: config too out of date (expected version ${configVersion}, got ${CFG.configVersion})`.error)
	process.exit()
} else if (Math.floor(global.CFG.configVersion) > Math.floor(configVersion)){
	console.error(`[matrix-server.main] FATAL ERROR: config too up to date (expected version ${configVersion}, got ${CFG.configVersion})`.error)
	process.exit()
} else if (global.CFG.configVersion < configVersion){
	console.warn(`[matrix-server.main] WARN       : config out of date, using defaults (expected version ${configVersion}, got ${CFG.configVersion})`.warn)
	process.exit()
} else if (global.CFG.configVersion > configVersion){
	console.warn(`[matrix-server.main] WARN       : config too up to date (expected version ${configVersion}, got ${CFG.configVersion})`.warn)
	process.exit()
} else {
	console.log(`[matrix-server.main] SUCCESS    : config v${configVersion} loaded!`.success)
}

let expressApp = express.default()

let files = fs.readdirSync(`${__dirname}/req`)
for (const key in files) {
	if (Object.prototype.hasOwnProperty.call(files, key)) {
		const element: any = files[key];
		try{
			require(__dirname+"/req/"+element).default(expressApp)
			console.log(`[matrix-server.main] SUCCESS    : loaded ${element}`.success)
		}catch(err){
			console.error(`[matrix-server.main] ERROR      : failed to load file ${element} (${err.message})`)
		}
	}
}

expressApp.get('/', (req, res) => {
	res.status(400).send(`Please connect to the matrix homeserver with a client, *not* your web browser. (connect via ${CFG.tlsEnabled ? "https" : "http"}://${CFG.server_name})`)
})

if(CFG.tlsEnabled === true){
	try{
		let key = fs.readFileSync(CFG.tlsKeyPath);
		let cert = fs.readFileSync(CFG.tlsCertPath);

		// @ts-ignore - X509Certificate was added in Node 15, unfortunately typings for 15 aren't out yet
		let valid = (new crypto.X509Certificate(cert)).checkPrivateKey(crypto.createPrivateKey(key)) && (new crypto.X509Certificate(cert)).checkHost(CFG.server_name)

		if(!valid){
			console.error(`[matrix-server.main] FATAL ERROR: TLS certificate/key pair verification failed`.error)
			process.exit()
		}

		https.createServer({
			key: key,
			cert: cert
		}, expressApp).listen(CFG.serverPort, () => {
			console.log(`[matrix-server.main] SUCCESS    : listening for connections on port ${CFG.serverPort} with TLS!`.success)
		});
	}catch(err){
		console.error(`[matrix-server.main] FATAL ERROR: TLS certificate/key pair verification failed`.error)
		process.exit()
	}
}else{
	expressApp.listen(CFG.serverPort, () => {
		console.log(`[matrix-server.main] SUCCESS    : listening for connections on port ${CFG.serverPort} without TLS!`.success)
	});
}