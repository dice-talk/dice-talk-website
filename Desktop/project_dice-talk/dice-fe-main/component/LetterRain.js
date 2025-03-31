import React, { useEffect } from 'react';
import { View, Image, Animated, Dimensions } from 'react-native';

const {height, width} = Dimensions.get('window');

const images = [
    require('../assets/event/love_letter_01.png'),
    require('../assets/event/love_letter_02.png'),
    require('../assets/event/love_letter_03.png'),
    require('../assets/event/love_letter_04.png'),
    require('../assets/event/love_letter_05.png'),
];

export default function LetterRain ({ onFinish }) {
    const animatedValues = images.map(() => new Animated.Value(0));

    useEffect(() => {
        Animated.stagger(
            300,
            animatedValues.map((value,index) => 
                Animated.timing(value, {
                    toValue: height,
                    duration: 1500,
                    useNativeDriver: true,
                })
            )
        ).start(() => {
            onFinish();
        });
    }, []);

    return (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
            {images.map((img, i) => (
                <Animated.Image
                    key={i}
                    source={img}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: (width / images.length) * i,
                        transform: [{ translateY: animatedValues[i] }],
                        width: 80,
                        height: 80,
                        resizeMode: 'contain',
                    }}
                    />
            ))}

        </View>
    );
};