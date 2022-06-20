import React from 'react';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/miniavs';
import { SvgCss } from 'react-native-svg';




export default Avatar = ({ seed, ...otherProps }) => {
    const xml = createAvatar(style, {
        seed,
        backgroundColor: "#e5e5e5",
        radius: "50",
        skinColor: ["yellow"]
    })



    return (
        <SvgCss
            xml={xml}
            {...otherProps}
        />
    )
}