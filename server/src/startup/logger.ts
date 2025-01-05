import winston from "winston";
require("express-async-errors");

const logFormat = winston.format.printf(({ level, message, timestamp, stack, userId, userEmail }) => {
	let logMessage = `${timestamp} ${level}: ${stack || message}`;
	if (userId || userEmail) {
		logMessage += ` (userId: ${userId}, userEmail: ${userEmail})`;
	}
	return logMessage;
});

const generalLogger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp(),
		logFormat
	),
	transports: [
		new winston.transports.Console({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.timestamp(),
				logFormat
			),
		}),
		new winston.transports.File({
			filename: "logfile.log",
			format: winston.format.combine(
				winston.format.timestamp(),
				logFormat
			),
		}),
	]
});

winston.exceptions.handle(
	new winston.transports.Console({
		format: winston.format.combine(
			winston.format.colorize(),
			winston.format.timestamp(),
			logFormat
		),
	}),
	new winston.transports.File({
		filename: "uncaughtExceptions.log",
		format: winston.format.combine(
			winston.format.timestamp(),
			logFormat
		),
	})
);

process.on("unhandledRejection", (ex) => {
	throw ex;
});

// Dedicated logger for login events
const loginLogger = winston.createLogger({
	format: winston.format.combine(
		winston.format.timestamp(),
		logFormat
	),
	transports: [
		new winston.transports.File({
			filename: "loginEvents.log",
			level: "info",
			format: winston.format.combine(
				winston.format.timestamp(),
				logFormat
			),
		}),
	]
});

export function initLogger() {
	// Initialize the general logger
	winston.add(generalLogger);

	// Initialize the login logger
	winston.add(loginLogger);
}

export { generalLogger as log, loginLogger };
