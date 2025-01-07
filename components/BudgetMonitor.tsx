import { useAppSelector } from "@/store/hooks"
import { Card, DataList, Flex, Link } from "@radix-ui/themes"
import React from "react"
import { styleText } from "util"

const BudgetMonitor = () => {
    const budgetStore = useAppSelector(store => store.budget)

    const formatBudget = (budget: number) => {
        if (budget >= 0) {
            return "+£" + budget.toLocaleString()
        } else {
            return "-£" + budget.toLocaleString().substring(1)
        }
    }

    return (
        <Card>
            <Flex direction="column" gap="4">
                <DataList.Root size="2">
                    <DataList.Item>
                        <DataList.Label minWidth="88px">Budget</DataList.Label>
                        <DataList.Value>
                            {formatBudget(budgetStore.budget).replace("+", "")}
                        </DataList.Value>
                    </DataList.Item>
                </DataList.Root>

                <DataList.Root size="1">
                    {/* <DataList.Item>
                        <DataList.Label minWidth="88px">Budget</DataList.Label>
                        <DataList.Value>
                            {formatBudget(budgetStore.budget).replace("+", "")}
                        </DataList.Value>
                    </DataList.Item> */}
                    <DataList.Item>
                        <DataList.Label minWidth="88px">
                            Daily Change
                        </DataList.Label>
                        <DataList.Value>
                            <span
                                className={`${
                                    budgetStore.dailyDelta >= 0
                                        ? "text-green-700"
                                        : "text-red-700"
                                }`}
                            >
                                {formatBudget(budgetStore.dailyDelta)}
                            </span>
                        </DataList.Value>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.Label minWidth="88px">
                            7 Day Average Change
                        </DataList.Label>
                        <DataList.Value>
                            <span
                                className={`${
                                    budgetStore.weeklyDelta >= 0
                                        ? "text-green-700"
                                        : "text-red-700"
                                }`}
                            >
                                {formatBudget(budgetStore.weeklyDelta)}
                            </span>
                        </DataList.Value>
                    </DataList.Item>
                </DataList.Root>
            </Flex>
            {/* <div className="flex flex-col space-y-2 text-sm">
                <span>
                    Current Budget:{" "}
                    {formatBudget(budgetStore.budget).replace("+", "")}
                </span>
                <div className="flex-stack">
                    <span>
                        Daily Delta: {formatBudget(budgetStore.dailyDelta)}
                    </span>
                    <span>
                        7 Day Delta: {formatBudget(budgetStore.weeklyDelta)}
                    </span>
                </div>
                <span>
                    7 Day Budget Projection:{" "}
                    {formatBudget(budgetStore.weekProjection).replace("+", "")}
                </span>
            </div> */}
        </Card>
    )
}

export default BudgetMonitor
