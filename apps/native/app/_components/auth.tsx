import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, TextInput, View } from 'react-native';
import Button from '~/app/_components/ui/button';
import { supabase } from '~/lib/supabase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      router.navigate('/');
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <View className='w-full flex flex-col px-8 py-4 gap-4'>
      <View>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder='email@address.com'
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder='Password'
          autoCapitalize={'none'}
        />
      </View>
      <Button
        label='Sign in'
        mode='primary'
        disabled={loading}
        onPress={() => signInWithEmail()}
      />
      <Button
        label='Sign up'
        mode='secondary'
        disabled={loading}
        onPress={() => signUpWithEmail()}
      />
    </View>
  );
}
