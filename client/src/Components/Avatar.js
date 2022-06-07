import React from 'react';
import { SvgCss } from 'react-native-svg';



export default function Avatar({ xml, ...otherProps }) {
    return <SvgCss xml={xml} {...otherProps} />
}