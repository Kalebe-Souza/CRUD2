import { createStackNavigator } from '@react-navigation/stack'
import FormVagas from './FormVagas.js'
import ListaVagas from './ListaVagas.js'

const Stack = createStackNavigator()

export default function StackVagas() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaVagas'
        >
            <Stack.Screen name='ListaVagas' component={ListaVagas} />

            <Stack.Screen name='FormVagas' component={FormVagas} />

        </Stack.Navigator>

    )
}
