import { createStackNavigator } from '@react-navigation/stack'
import ListaConcursos from './ListaConcursos.js'
import FormConcursos from './FormConcursos.js'

const Stack = createStackNavigator()

export default function StackConcursos() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaConcursos'
        >
            <Stack.Screen name='ListaConcursos' component={ListaConcursos} />

            <Stack.Screen name='FormConcursos' component={FormConcursos} />

        </Stack.Navigator>

    )
}
