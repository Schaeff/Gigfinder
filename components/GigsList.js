import React from 'react'
import { Text } from 'react-native'
import { List } from 'react-native-elements'
import GigsListItem from './GigsListItem'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getGigPlaylist, getPlaylist } from '../selectors'
import * as actionCreators from '../actions/actionCreators'
Promise = require('bluebird')

import { Audio } from 'expo'

class GigsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sounds: {}
    }
  }

  componentWillMount() {
    return this.loadSounds();
  }

  loadSounds(sounds) {
    // create a sound object for each entry
    const {
      city,
      state
    } = this.props
    const {
      gigs
    } = city

    this.props.onLoadSounds() // set the state to loading

    return Promise.all(gigs.map(gig => gig.gigId).map(x => getGigPlaylist(x)(state)).filter(x => x.length > 0).map((playlist, i) => {
      return Promise.props({
          gigId: gigs[i].gigId,
          sound: Expo.Audio.Sound.create({
            uri: playlist[0]
          }, {
            shouldPlay: false
          }, undefined, true).then(x => x.sound)
        })
        .then(res => {
          return {
            [res.gigId]: res.sound
          }
        })
    })).then(res => {
      console.log(res)
      return this.onSoundsLoaded(res.reduce((a, b) => Object.assign(a, b), {}))
    }).catch(console.log)
  }

  componentWillReceiveProps(nextProps) {
    const currentGigId = this.props.play.gigId
    const nextGigId = nextProps.play.gigId
    const { sounds } = this.state

    if(nextGigId !== currentGigId) {
      if(currentGigId === 0) {
        if(this.state.sounds[nextGigId]) {
          return this.state.sounds[nextGigId].playAsync()
        } else {
          return console.log("no tracks")
        }
      }
      if(nextGigId === 0) {
        if(this.state.sounds[currentGigId]) {
          return this.state.sounds[currentGigId].pauseAsync()
        }
      }
    }
  }
  

  onSoundsLoaded(sounds) {
    this.state.sounds = sounds
    return this.props.onSoundsLoaded()
  }

  render() {
    const { city, navigation, playlist, play } = this.props
    const { gigs } = city

    return (
      <List>
        {gigs.map((g, i) => (
          <GigsListItem gig={g} key={i} navigation={navigation} />
        ))}
      </List>
    )
  }
}

const mapStateToProps = state => ({
  play: state.play,
  playlist: getPlaylist(state),
  state: state
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(GigsList)

