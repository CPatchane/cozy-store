// customized function to center a popup window
// source https://stackoverflow.com/a/16861050
export function popupCenter(url, title, w, h) {
  /* global screen */
  // Fixes dual-screen position
  //                      Most browsers      Firefox
  var dualScreenLeft = window.screenLeft || screen.left
  var dualScreenTop = window.screenTop || screen.top

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height

  var left = width / 2 - w / 2 + dualScreenLeft
  var top = height / 2 - h / 2 + dualScreenTop
  var newWindow = window.open(
    '',
    title,
    'scrollbars=yes, width=' +
      w +
      ', height=' +
      h +
      ', top=' +
      top +
      ', left=' +
      left
  )
  newWindow.location.href = url

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus()
  }
  return newWindow
}
