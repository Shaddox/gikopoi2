const { ref, toRef, watch } = Vue

const handSymbols = {
    rock: "🪨",
    paper: "📄",
    scissors: "✂"
}

export default {
    props: ["socket", "jankenState", "users", "myUserId"],
    template: "#janken-slot",
    setup(props)
    {
        const users = toRef(props, "users")
        
        const isVisible = ref(false)
        const isActive = ref(false)
        const state = toRef(props, "jankenState")
        const namedPlayer = ref(null)
        const player1 = ref(null)
        const player2 = ref(null)
        const isCurrentUserPlaying = ref(false)
        const showResults = ref(false)
        const isHandChosen = ref(false)
        const isWaitingForOpponent = ref(false)
        
        const display = () => isVisible.value = true
        const hide = () => isVisible.value = false
        
        const join = () => {
            if (!isCurrentUserPlaying.value && !isActive.value)
                props.socket.emit("user-want-to-join-janken")
        }
        const quit = () => {
            if (isCurrentUserPlaying.value)
                props.socket.emit("user-want-to-quit-janken")
        }
        
        const chooseHand = (handKey) =>
        {
            isHandChosen.value = true
            props.socket.emit("user-want-to-choose-janken-hand", handKey)
            setTimeout(() =>
            {
                // to avoid the flashing message of waiting for the other
                // opponent if you're the last to pick
                isWaitingForOpponent.value = true
            }, 500)
        }
        
        const capitalizeText = (str) => str.charAt(0).toUpperCase() + str.slice(1)
        
        watch(state, () =>
        {
            player1.value = users.value[state.value.player1Id] || null
            player2.value = users.value[state.value.player2Id] || null
            namedPlayer.value = users.value[state.value.namedPlayerId] || null
            
            isCurrentUserPlaying.value =
                state.value.player1Id == props.myUserId
                || state.value.player2Id == props.myUserId
            
            if (isCurrentUserPlaying.value)
                isVisible.value = true
                
            let resetTime = 2000
            
            if (state.value.stage == "choosing")
            {
                isHandChosen.value = false
                isWaitingForOpponent.value = false
                
                isActive.value = true
                showResults.value = false
            }
            else if (state.value.stage == "end")
            {
                setTimeout(() => {
                    showResults.value = true
                }, 2000)
                resetTime = 4000
            }
            
            if (state.value.stage == "end" || state.value.stage == "quit")
            {
                setTimeout(() => {
                    isActive.value = false
                    if (isCurrentUserPlaying.value)
                    {
                        isVisible.value = true
                        isCurrentUserPlaying.value = false
                    }
                }, resetTime)
            }
        })
        
        return {
            handSymbols,
            myUserId: props.myUserId,
            
            isVisible,
            isActive,
            state,
            namedPlayer,
            player1,
            player2,
            isCurrentUserPlaying,
            showResults,
            isHandChosen,
            isWaitingForOpponent,
            
            display,
            hide,
            
            join,
            quit,
            
            chooseHand,
            
            capitalizeText,
        }
    },
    beforeUnmount()
    {
        this.quit()
    }
}