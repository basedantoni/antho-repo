import { Stack, Link } from 'expo-router';
import { Button, View, Text } from 'react-native';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Home' }} />
      <View>
        <Text>Home</Text>
        <Link href={{ pathname: '/details', params: { name: 'Anthony' } }} asChild>
          <Button title="Show Details" />
        </Link>
      </View>
    </>
  );
}
