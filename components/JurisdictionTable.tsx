import { useAppSelector } from "@/store/hooks"

export default function JurisdictionTable() {
    const metrics = useAppSelector(store => store.metrics)
    const policies = useAppSelector(store => store.metrics)

    return null
}
