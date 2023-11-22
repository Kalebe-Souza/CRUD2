import { createStackNavigator } from '@react-navigation/stack'
import ListaCandidatos from './ListaCandidatos'
import FormCandidatos from './FormCandidatos'


const Stack = createStackNavigator()

export default function StackCandidatos() {
    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName='ListaCandidatos'
        >
            <Stack.Screen name='ListaCandidatos' component={ListaCandidatos} />
            <Stack.Screen name='FormCandidatos' component={FormCandidatos} />

        </Stack.Navigator>

    )
}
