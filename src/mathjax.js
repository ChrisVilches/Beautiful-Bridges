export function configMathJax () {
  window.MathJax.Hub.Config({
    'HTML-CSS': {
      preferredFont: 'TeX',
      availableFonts: ['STIX', 'TeX'],
      linebreaks: { automatic: true },
      EqnChunk: (window.MathJax.Hub.Browser.isMobile ? 10 : 50)
    },
    tex2jax: { inlineMath: [['$', '$']], processEscapes: true, ignoreClass: 'tex2jax_ignore|dno' },
    TeX: {
      extensions: ['begingroup.js'],
      noUndefined: { attributes: { mathcolor: 'red', mathbackground: '#FFEEEE', mathsize: '90%' } },
      Macros: { href: '{}' }
    },
    messageStyle: 'none'
  })
}
