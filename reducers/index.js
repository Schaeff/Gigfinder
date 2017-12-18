import { combineReducers } from 'redux'
import search from './search'
import db from './db'
import play from './play'

const rootReducer = combineReducers({
	search,
	db,
	play
})

export default rootReducer
