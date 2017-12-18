import { compose, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from '../reducers/index'

const reduxStore = compose(createStore)(rootReducer, applyMiddleware(thunk))

export default reduxStore