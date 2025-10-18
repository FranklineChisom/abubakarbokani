document.getElementById('clickMe').addEventListener('click', () => {
  const out = document.getElementById('output')
  out.textContent = `Button clicked at ${new Date().toLocaleTimeString()}`
})
