export default function (ctx) {
  const theme = localStorage.getItem('theme')

  if (theme === 'dark') {
    document.body.setAttribute('data-theme', 'dark')
  } else {
    document.body.setAttribute('data-theme', 'light')
  }
}
