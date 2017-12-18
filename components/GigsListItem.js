import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../actions/actionCreators'
import { getPlaylist } from '../selectors'

import { ListItem } from 'react-native-elements'
import { View } from 'react-native'

var sound;

const GigsListItem = props => {
  const { gig, gigs, play, playlist } = props

  const requiresPlayer = playlist.length > 0

  if (!requiresPlayer) {
    return (
      <View>
        <ListItem
          onLongPress={onLongPress(props)}
          onPressOut={onReleasePress(props)}
          title={gigs[gig.gigId].title}
        />
      </View>
    )
  }

  const toPlay = playlist[0]

  const playing = play.state === 'loading' && play.gigId === gig.gigId

  const title = playing
    ? ['Playing from', playlist.length, 'sources'].join(' ')
    : gigs[gig.gigId].title

  return (
    <View>
      <ListItem
        onLongPress={onLongPress(props)}
        onPressOut={onReleasePress(props)}
        title={title}
      />
    </View>
  )
}

const onLongPress = props => () => {
  const { gig, onHoldGig, playlist } = props
  console.log("press")
  return onHoldGig(gig.gigId)
}

const onReleasePress = props => () => {
  const { gig, onReleaseGig, playlist } = props
  return onReleaseGig(gig.gigId)
}

const mapStateToProps = state => ({
  gigs: state.db.gigs,
  play: state.play,
  playlist: getPlaylist(state)
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GigsListItem)
