import { reactive } from 'vue'

interface GlobalCaptchaState {
    isVerifying: boolean
    isError: boolean
    token: string | null
}

const state: GlobalCaptchaState = reactive({
    isVerifying: false,
    isError: false,
    token: null,
})

export const useCaptcha = () => {
    return state
}