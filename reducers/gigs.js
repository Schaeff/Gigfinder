import { FETCH_GIGS_RESULTS } from '../actions/actionConstants'

var initialState = {}

const gigs = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GIGS_RESULTS: {
      const { results } = action.payload

      const newGigs = Object.assign(
        {},
        ...results.map(gig => ({
          [gig.event]: {
            id: gig.event,
            title: gig.title,
            lineup: gig.lineup.map(dj => ({
              djId: dj.dj
            }))
          }
        }))
      )

      return {
        ...state,
        ...newGigs
      }
    }
    default: {
      return state
    }
  }
}

export default gigs
