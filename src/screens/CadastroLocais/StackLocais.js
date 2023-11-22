import { createStackNavigator } from '@react-navigation/stack'
import ListaLocais from './ListaLocais.js'
import FormLocais from './FormLocais.js'

const Stack = createStackNavigator()

export default function StackLocais() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaLocais'
        >
            <Stack.Screen name='ListaLocais' component={ListaLocais} />

            <Stack.Screen name='FormLocais' component={FormLocais} />

        </Stack.Navigator>

    )
}
