import React from 'react'
import { Text } from 'react-native'
import GigsList from './GigsList'

const GigsListWrapper = props => {
    const { city, gigs, djs } = props
    const gigsIds = city.gigs

    const cityLoading = city.loading;

	var playlistsLoading =
		gigsIds.map(gig => {
			return gigs[gig.gigId].lineup
				.map(dj => djs[dj.djId].loading)
				.reduce((a, b) => a || b, false)
		})
		.reduce((a, b) => a || b, false)
		
    const loading = cityLoading || playlistsLoading

    if (loading) {
      return <Text>{'Loading'}</Text>
    }

    return (
      <GigsList city={props.city} id={props.id} navigation={props.navigation} />
    )
}

export default GigsListWrapper

