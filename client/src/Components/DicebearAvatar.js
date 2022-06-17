import React, { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/miniavs';
import { SvgCss } from 'react-native-svg';

import { moderateScale, scale } from "react-native-size-matters"



export default function DicebearAvatar({ storeXML, seed }) {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const xml = createAvatar(style, {
        seed,
        backgroundColor: "#e5e5e5",
        radius: "50",
        skinColor: ["yellow"]
    })

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);



    useEffect(() => {
        storeXML(xml)
    }, [seed])

    return (
        <SvgCss
            xml={xml}
            width={isKeyboardVisible ? moderateScale(100, -0.1) : moderateScale(185, 0.01)}
            height={isKeyboardVisible ? moderateScale(100, -0.1) : moderateScale(185, 0.01)}
        />
    )
}