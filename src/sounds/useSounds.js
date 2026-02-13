import { Howl } from 'howler'

// We use free online sound effects - you can replace these URLs with your own
const sounds = {
  wow: null,
  pop: null,
  success: null,
  claim: null,
}

// Initialize sounds lazily
const getSound = (name) => {
  if (sounds[name]) return sounds[name]

  const soundUrls = {
    wow: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    pop: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    claim: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3',
  }

  sounds[name] = new Howl({
    src: [soundUrls[name]],
    volume: 0.5,
    preload: true,
  })

  return sounds[name]
}

export const playWow = () => {
  try { getSound('wow').play() } catch (e) { console.log('Sound not available') }
}

export const playPop = () => {
  try { getSound('pop').play() } catch (e) { console.log('Sound not available') }
}

export const playSuccess = () => {
  try { getSound('success').play() } catch (e) { console.log('Sound not available') }
}

export const playClaim = () => {
  try { getSound('claim').play() } catch (e) { console.log('Sound not available') }
}

