import { useCallback, useEffect, useRef, useState } from "react"
import SockJS from "sockjs-client"
import { Client, IMessage } from "@stomp/stompjs"
import { useAppDispatch } from "@/store/hooks"
import { clearMetrics, updateMetrics } from "@/store/metrics"

interface Notification {
    type: "event" | "metrics"
    payload: any
}

interface Event {
    type: string
    payload: any
}

const useGame = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [isInitialized, setIsInitialized] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isPaused, setIsPaused] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [gameId, setGameId] = useState<string | null>(null)

    const socket = useRef<WebSocket | null>()
    const stompClient = useRef<Client | null>()

    const dispatch = useAppDispatch()

    const handleMessage = useCallback((body: Notification) => {
        if (body.type == "metrics") {
            dispatch(updateMetrics(body.payload))
            return
        }

        if (body.type == "event") {
            const event: Event = body.payload
            if (event.type == "simulation_initialized") {
                setIsInitialized(true)
            }
        }
    }, [])

    const sendCommand = useCallback(
        (payload: any) => {
            if (!stompClient.current) {
                return
            }

            stompClient.current.publish({
                destination: `/game/${gameId}/command`,
                headers: {},
                body: JSON.stringify(payload)
            })

            if (payload.type == "quit") {
                if (stompClient.current) {
                    stompClient.current.deactivate()
                    setIsConnected(false)
                    setGameId(null)
                }
            }
        },
        [gameId]
    )

    const pauseGame = useCallback(() => {
        sendCommand({
            type: "pause"
        })

        setIsPaused(true)
    }, [sendCommand, setIsPaused])

    const resumeGame = useCallback(() => {
        sendCommand({
            type: "resume"
        })

        setIsPaused(false)
    }, [sendCommand])

    const startGame = useCallback(() => {
        if (isLoading) {
            return
        }

        if (stompClient.current) {
            // tear down stompClient connection
            stompClient.current.deactivate()
            setIsConnected(false)
            setGameId(null)
        }

        setGameId(null)
        setIsInitialized(false)
        setError(null)

        // clear metrics
        dispatch(clearMetrics())

        const startSocket = async (gameId: string) => {
            socket.current = new SockJS("http://localhost:8080/websocket")
            stompClient.current = new Client({
                webSocketFactory: () => socket.current,
                debug: str => {
                    console.log(str) // Debugging STOMP messages
                },
                onConnect: () => {
                    setIsConnected(true)

                    // Subscribe to a STOMP topic
                    stompClient.current?.subscribe(
                        "/topic/notification/" + gameId,
                        (message: IMessage) => {
                            handleMessage(JSON.parse(message.body))
                        }
                    )

                    // debugging
                    console.log("Connected to WebSocket server")
                },
                onDisconnect: () => {
                    setIsConnected(false)

                    // debugging
                    console.log("Disconnected from WebSocket")
                },
                onStompError: frame => {
                    setError("Error communicating with server over stomp")

                    // debugging
                    console.error("STOMP error:", frame)
                }
            })

            stompClient.current.activate()
        }

        const createGame = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8080/game/create",
                    {
                        method: "POST",
                        headers: []
                    }
                )

                if (!response.ok) {
                    setError("failed to create game")
                }

                const data = await response.json()

                // Process the response data here
                setGameId(data["id"])
                startSocket(data["id"])
            } catch (err) {
                console.error("failed to create game")
                setError("failed to create game")
            } finally {
                setIsLoading(false)
            }
        }

        setIsLoading(true)
        createGame()
    }, [])

    return {
        error,
        isLoading,
        isConnected,
        isInitialized,
        isPaused,
        gameId,
        sendCommand,
        startGame,
        pauseGame,
        resumeGame
    }
}

export default useGame
