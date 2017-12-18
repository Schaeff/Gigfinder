import { SEARCH, SEARCH_RESULTS } from '../actions/actionConstants'

var initialState = {
  searching: false,
  searchingFor: '',
  results: []
}

const search = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH: {
      const { text } = action.payload

      return {
        ...state,
        searching: true,
        searchingFor: text,
        results: []
      }
    }
    case SEARCH_RESULTS: {
      const { results } = action.payload

      return {
        ...state,
        searching: false,
        results: results
      }
    }
    default: {
      return state
    }
  }
}

export default search
