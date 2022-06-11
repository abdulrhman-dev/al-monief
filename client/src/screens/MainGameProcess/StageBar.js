import React from "react"
import {
    View,
    Text,
    StyleSheet
} from "react-native"
// Data
import items from "./stageBarItems"


export default StageBar = ({ stage = 1 }) => {


    return (
        <View style={styles.stageBarContainer}>
            {items.map((item, index) => (
                <StagePoint item={item} active={(index + 1) <= stage} />
            ))}


            <StageLine stage={stage} active={true} />
            <StageLine />


        </View>
    )
}

const StagePoint = ({ item, active }) => {

    return (
        <View style={[styles.stagePointContainer, { backgroundColor: active ? "#e06394" : "lightgrey" }]}>
            <View style={styles.stagePointIcon}>
                {item.icon}
            </View>
            <View style={styles.stagePointTextContainer}>
                <Text style={styles.stagePointText}>
                    {item.title}
                </Text>
            </View>
        </View>
    )
}

const StageLine = ({ stage, active }) => {
    return (
        <View style={active ? [styles.stageLine, { width: `${(stage - 1) * 20}%` }] : [styles.stageLine, styles.stageLineInActive]} />
    )
}

const styles = StyleSheet.create({
    stageBarContainer: {
        position: "relative",
        width: "100%",
        height: 100,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    stagePointContainer: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    stagePointIcon: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    stagePointTextContainer: {
        position: "absolute",
        width: "100%",
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        top: 50
    },
    stagePointText: {
        fontFamily: "NotoKufiArabic-Medium",
        fontSize: 11.5
    },
    stageLine: {
        position: "absolute",
        width: "20%",
        left: 20,
        zIndex: -1,
        height: 12,
        backgroundColor: "#e06394"
    },
    stageLineInActive: {
        width: 0,
        width: "80%",
        zIndex: -2,
        backgroundColor: "lightgrey"
    }
})