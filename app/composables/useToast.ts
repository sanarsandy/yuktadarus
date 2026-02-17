export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: number
    message: string
    type: ToastType
}

export const useToast = () => {
    const toasts = useState<Toast[]>('toasts', () => [])

    const show = (message: string, type: ToastType = 'info') => {
        const id = Date.now()
        toasts.value.push({ id, message, type })

        // Auto remove after 3 seconds
        setTimeout(() => {
            remove(id)
        }, 3000)
    }

    const remove = (id: number) => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    return {
        toasts,
        show,
        remove,
        success: (msg: string) => show(msg, 'success'),
        error: (msg: string) => show(msg, 'error'),
        info: (msg: string) => show(msg, 'info'),
        warning: (msg: string) => show(msg, 'warning')
    }
}
