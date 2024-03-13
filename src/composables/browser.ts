import browser from 'browser-detect'

var detected: any = null

export const useBrowserDetect = () => {
  if(!detected) {
    detected = browser()
  }

  return detected
}