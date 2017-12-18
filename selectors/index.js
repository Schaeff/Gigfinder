export const getGigPlaylist = gigId => state => {
  const {
    db,
    play
  } = state
  const {
    gigs,
    djs
  } = db

  return gigs[gigId].lineup
    .map(dj => djs[dj.djId].playlist)
    .reduce((a,b) => a.concat(b), [])
}

export const getPlaylist = state => {
  const {
    play
  } = state

  return getGigPlaylist(play.gigId)
}