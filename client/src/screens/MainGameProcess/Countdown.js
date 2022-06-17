import React, { useState, useEffect } from "react"
import { View, Text, StyleSheet } from "react-native"


export default Countdown = ({ startingCountdown = 5, finish }) => {
    const [countdown, setCountdown] = useState(startingCountdown)

    useEffect(() => {
        let interval;

        interval = setInterval(() => {
            if (countdown - 1 < 0) {
                finish()
                return clearInterval(interval)
            }

            setCountdown(countdown - 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [countdown]);

    return (
        <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}> باقي وقت: {countdown} </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    countdownContainer: {
        position: "absolute",
        backgroundColor: "grey",
        width: "100%",
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        top: "81%"
    },
    countdownText: {
        fontFamily: "NotoKufiArabic-Medium",
        color: "white",
        fontSize: 15
    }
})