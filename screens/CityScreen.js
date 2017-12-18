import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import GigsListWrapper from '../components/GigsListWrapper'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actionCreators from '../actions/actionCreators'

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'mediumseagreen',
    color: 'white',
    fontSize: 16,
    height: 50,
    lineHeight: 50,
    marginBottom: 12,
    marginHorizontal: 16,
    textAlign: 'center'
  },
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  spacer: {
    flex: 1
  }
})

const CityScreen = props => {
  const { navigation, city, gigs, djs } = props
  const { params } = navigation.state
  const { id } = params

  return (
    <ScrollView style={styles.container}>
      <GigsListWrapper djs={djs} gigs={gigs} city={city[id]} id={id} navigation={navigation} />
    </ScrollView>
  )
}

CityScreen.navigationOptions = () => {
  return {
    title: 'City'
  }
}

const mapStateToProps = state => ({
  city: state.db.city,
  gigs: state.db.gigs,
  djs: state.db.djs
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CityScreen)