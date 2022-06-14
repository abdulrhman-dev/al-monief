import React, { useEffect } from 'react';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/miniavs';
import { SvgCss } from 'react-native-svg';



export default function DicebearAvatar({ storeXML, seed }) {
    const xml = createAvatar(style, {
        seed,
        backgroundColor: "#e5e5e5",
        radius: "50",
        skinColor: ["yellow"]
    })

    useEffect(() => {
        storeXML(xml)
    }, [seed])

    return <SvgCss xml={xml} width="150" height="150" />
}