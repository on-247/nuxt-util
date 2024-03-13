import { reactive, watch } from 'vue'

type Storage = Record<string, any>

type Init = () => Record<string, any>

let isLocalStorageSynced = false
const state = reactive({}) as Storage

const localStorageEntries = () => {
    if (process.server) {
        return []
    }
    let entries: [string, string][] = []
    for(let i = 0; i < localStorage.length; i++){
        let storageKey = localStorage.key(i) as string
        let storageValue = localStorage.getItem(storageKey) as string
        entries.push([storageKey, storageValue])
    }
    return entries
}

/** Sync data from localStorage to the reactive state */
const syncFromLocalStorage = (init?: Init) => {
    for (let [key, value] of localStorageEntries()){
        try {
            state[key] = JSON.parse(value)
        } catch(e) {
            console.error(`Could not save '${key}' to reactive state: ${e}`)
        }
    }

    if (init) {
        for (let [key, value] of Object.entries(init())) {
            if (!(key in state)) {
                state[key] = value
            }
        }
    }

    isLocalStorageSynced = true
}

/** Sync data from reactive state to the localStorage */
const syncFromState = (updatedState: Storage) => {
    if (!isLocalStorageSynced) {
        return
    }

    for (let [key, value] of Object.entries(updatedState)) {
        try {
            localStorage.setItem(key, JSON.stringify(value || null))
        } catch(e) {
            console.error(`Could not save '${key}' to localStorage: ${e}`)
        }
    }

    // Remove localStorage key that are not present on st
    for(let [key, _] of localStorageEntries()){
        if (!(key in updatedState)) {
            localStorage.removeItem(key)
        }
    }
}

watch(state, (updatedState: Storage) => syncFromState(updatedState), { deep: true })

export const useLocalStorage = (init?: Init) => {
    if (!isLocalStorageSynced) {
        syncFromLocalStorage(init)
    }

    return state
}