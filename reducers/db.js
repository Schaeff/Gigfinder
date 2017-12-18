import { combineReducers } from 'redux'
import city from './city'
import gigs from './gigs'
import djs from './djs'

const dbReducer = combineReducers({
	city,
	gigs,
	djs
})

export default dbReducer
