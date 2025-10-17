import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderImage = ({ size = 100, text = 'A', backgroundColor = '#6200EE', textColor = 'white' }) => {
  return (
    <View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor 
        }
      ]}
    >
      <Text style={[styles.text, { color: textColor, fontSize: size * 0.5 }]}>
        {text.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontWeight: 'bold',
  },
});

export default PlaceholderImage;