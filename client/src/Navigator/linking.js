const config = {
    screens: {
        TransferringScreen: {
            path: "room/:id",
            parse: {
                id: (id) => `${id}`
            }
        }
    }
}

const linking = {
    prefixes: ["moneif://game"],
    config
}

export default linking