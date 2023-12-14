import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: (): { version: string, leftDrawerOpen: boolean, easytouchVersion: string } => ({
    version: '0.1',
    leftDrawerOpen: false,
    easytouchVersion: 'EasyTouch 2.8'
  }),
  actions: {
    toggleDrawer () {
      this.leftDrawerOpen = !this.leftDrawerOpen
    }
  }
})
