import React from 'react'
import { StyleSheet, View } from 'react-native'

import { SearchBar, List, ListItem } from 'react-native-elements'
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

const HomeScreen = props => {
  const { searchAsync, navigation, results, fetchGigsAsync } = props
  const { navigate } = navigation

  return (
    <View style={styles.container}>
      <SearchBar onChangeText={searchAsync} placeholder="Where are you" />
      <List>
        {results.map((r, i) => (
          <ListItem
            key={i}
            onPress={() => {
              fetchGigsAsync(r.id)
              return navigate('City', { id: r.id })
            }}
            title={r.city ? [r.city, r.region].join(', ') : r.region}
          />
        ))}
      </List>
    </View>
  )
}

HomeScreen.navigationOptions = () => {
  return {
    title: 'Home'
  }
}

const mapStateToProps = state => ({
  searching: state.search.searching,
  searchingFor: state.search.searchingFor,
  results: state.search.results
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionCreators, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
