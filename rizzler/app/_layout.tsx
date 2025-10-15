import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View,Text } from 'react-native';


export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false); // hide splash after delay
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    // Your custom splash page
    return (
      <View style={styles.splashContainer}>
        <Text>Rizz</Text>
        
      </View>
    );
  }

  // Main app stack after splash
  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  splashText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#ffff',
    justifyContent: 'center', // vertical center
    alignItems: 'center',     // horizontal center
  },
  reactLogo: {
    height: 251,
    width: 272,
  }
});
