import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      modal: ''
    }
  },
  actions: {
    openModal(name) {
      this.modal = name
      if(document.body.scrollHeight > window.innerHeight){
        document.documentElement.style.overflow = 'hidden'
        document.body.style.paddingRight = `${document.body.offsetWidth - document.body.clientWidth}px`
      }
    },
    closeModal() {
      this.modal = ''
      if(document.body.scrollHeight > window.innerHeight) {
        document.documentElement.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
      }
    }
  },
})