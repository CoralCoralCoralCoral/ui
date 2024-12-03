import React, { useCallback, useEffect, useRef, useState } from "react"
import SockJS from "sockjs-client"
import { Client, IMessage } from "@stomp/stompjs"
import { useAppDispatch } from "@/store/hooks"
import { MetricsUpdate, updateMetrics } from "@/store/metrics"

const useMessaging = () => {
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [gameId, setGameId] = useState<string | null>(null)

    const socket = useRef<WebSocket | null>()
    const stompClient = useRef<Client | null>()

    const dispatch = useAppDispatch()

    const handleMessage = useCallback((body: MetricsUpdate) => {
        dispatch(updateMetrics(body))
    }, [])

    const sendCommand = useCallback(
        (payload: any) => {
            if (!stompClient.current) {
                return
            }

            stompClient.current.publish({
                destination: `/game/${gameId}/command`
            })
        },
        [gameId]
    )

    useEffect(() => {
        let isCancelled = false

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
                        "/topic/game-update/" + gameId,
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

        const startGame = async () => {
            const response = await fetch("http://127.0.0.1:8080/game/create", {
                method: "POST",
                headers: []
            })

            if (isCancelled) {
                return
            }

            if (!response.ok) {
                setError("failed to create game")
            }

            const data = await response.json()
            if (isCancelled) {
                return
            }

            // Process the response data here
            setGameId(data["id"])
            startSocket(data["id"])
        }

        startGame()

        return () => {
            if (stompClient.current) {
                // tear down stomp client
            }

            if (socket.current) {
                // tear down socket connection
                socket.current.close()
            }

            isCancelled = true
        }
    }, [socket, stompClient])

    return { error, isConnected, gameId, sendCommand }
}

export default useMessaging
