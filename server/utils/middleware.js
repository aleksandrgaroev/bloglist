const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
	logger.info('Method:', req.method)
	logger.info('Path:  ', req.path)
	logger.info('Body:  ', req.body)
	logger.info('---')
	next()
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
	logger.error(error.message)

	switch (error.name) {
		case 'CastError':
			return res.status(400).send({ error: 'malformatted id' })
		case 'ValidationError':
			return res.status(400).json({ error: error.message })
		case 'JsonWebTokenError':
			return res.status(401).json({ error: 'invalid token' })
		case 'TokenExpiredError':
			return res.status(401).json({ error: 'token expired' })
	}

	next(error)
}

const tokenExtractor = (req, res, next) => {
	const authorization = req.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		req.token = authorization.substring(7)
	}

	next()
}

const userExtractor = async (req, res, next) => {
	const token = req.token
	const decodedToken = jwt.verify(token, process.env.SECRET)
	if (decodedToken.id) {
		req.user = await User.findById(decodedToken.id)
	}

	next()
}

module.exports = {
	requestLogger,
	unknownEndpoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
}
