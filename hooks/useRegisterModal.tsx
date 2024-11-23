import { create } from "zustand"
declare type RegisterModalTypeStore = {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
 }

const useRegisterModal = create<RegisterModalTypeStore>((set) => ({
   isOpen: false,
   onOpen: () => set({ isOpen: true }),
   onClose: () => set({ isOpen: false }),
}))

export default useRegisterModal