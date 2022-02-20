const spaceRegex = /\s+/g

const removeExtraWhiteSpace = str => {
  return str.replace(spaceRegex, ' ').trim()
}

const parseInput = content => {
  const lines = content.split('\n').filter(line => line.length > 0)
  const [N, H, alpha, beta] = removeExtraWhiteSpace(lines[0]).split(' ').map(Number)
  const ground = []
  for (let i = 0; i < N; i++) {
    const line = lines[i + 1]
    if (typeof line !== 'string') continue
    const [x, y] = removeExtraWhiteSpace(line).split(' ').map(Number)
    ground.push({ x, y })
  }

  return { N, H, alpha, beta, ground }
}

const getInputErrors = data => {
  const { N, H, alpha, beta, ground } = data

  if (!(N >= 2 && N <= 10000)) return '$N$ must satisfy $2 \\leq N \\leq 10^4$'
  if (!(H >= 1 && H <= 100000)) return '$H$ (height) must satisfy $1 \\leq H \\leq 10^5$'
  if (N !== ground.length) return '$N$ and the actual number of elements in the array differ'

  const alphaBetaErr = '$α, β$ must satisfy $1 \\leq α, β \\leq 10^4$'

  if (!(alpha >= 1 && alpha <= 10000)) return alphaBetaErr
  if (!(beta >= 1 && beta <= 10000)) return alphaBetaErr

  for (let i = 0; i < ground.length - 1; i++) {
    const x1 = ground[i].x
    const x2 = ground[i + 1].x

    const xErr = '$x$ values must satisfy $0 \\leq x_1 < x_2 < ... < x_n \\leq 10^5$'

    if (x1 >= x2) return xErr
    if (!(x1 >= 0 && x1 <= 100000)) return xErr
  }

  for (let i = 0; i < ground.length; i++) {
    const y = ground[i].y
    if (!(y >= 0 && y < H)) return '$y$ values must satisfy $0 \\leq yi < h$'
  }

  return null
}

module.exports = {
  getInputErrors,
  parseInput,
  removeExtraWhiteSpace
}
