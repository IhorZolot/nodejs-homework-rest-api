import mongoose from 'mongoose'

import app from './app.js'
// aMqMWWXOCzzq1aWS
const DB_HOST =
	'mongodb+srv://Ihor:aMqMWWXOCzzq1aWS@cluster0.hzc4eni.mongodb.net/my-contacts?retryWrites=true&w=majority'

mongoose
	.connect(DB_HOST)
	.then(() => {
		console.log('Database connection successful')
		app.listen(3000, () => {
			console.log('Server running. Use our API on port: 3000')
		})
	})
	.catch(error => {
		console.error('Database connection error:', error.message)
		process.exit(1)
	})
