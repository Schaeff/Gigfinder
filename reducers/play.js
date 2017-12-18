import { HOLD_GIG, RELEASE_GIG, SOUNDS_LOADED, SOUNDS_LOADING } from '../actions/actionConstants'

var initialState = {
  gigId: 0,
  player: {
    isPlaying: false,
    isBuffering: false,
    isLoading: false,
    isUnloading: false
  }
}

const play = (state = initialState, action) => {
  switch (action.type) {
    case HOLD_GIG: {
      const { gigId } = action.payload
      return {
        ...state,
        gigId
      }
    }
    case RELEASE_GIG: {
      return {
        ...state,
        gigId: 0,
      }
    }
    case SOUNDS_LOADING: {
      return {
        ...state,
        player: {
          ...state.player,
          isLoading: true 
        } 
      }
    }
    case SOUNDS_LOADED: {
      return {
        ...state,
        player: {
          ...state.player,
          isLoading: false 
        } 
      }
    }
    default: {
      return state
    }
  }
}

export default play
