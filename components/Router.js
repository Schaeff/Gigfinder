import { StackNavigator } from 'react-navigation'

import HomeScreen from '../screens/HomeScreen'
import CityScreen from '../screens/CityScreen'

const Router = StackNavigator(
	{
		Home: { screen: HomeScreen },
		City: { screen: CityScreen }
	},
	{
		initialRouteName: 'Home'
	}
)

export default Router
