import { createStackNavigator } from '@react-navigation/stack'
import ListaResultados from './ListaResultados.js'
import FormResultados from './FormResultados.js'

const Stack = createStackNavigator()

export default function StackResultados() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaResultados'
        >
            <Stack.Screen name='ListaResultados' component={ListaResultados} />

            <Stack.Screen name='FormResultados' component={FormResultados} />

        </Stack.Navigator>

    )
}
