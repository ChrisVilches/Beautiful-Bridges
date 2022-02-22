import _ from 'underscore'

const spaceRegex = /\s+/g

const removeExtraWhiteSpace = str => str.replace(spaceRegex, ' ').trim()

export const parseInput = content => {
  try {
    const lines = content.split('\n').filter(line => line.length > 0)
    const [N, H, alpha, beta] = removeExtraWhiteSpace(lines[0]).split(' ').map(Number)
    const ground = []
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i + 1]
      if (typeof line !== 'string') continue
      const [x, y] = removeExtraWhiteSpace(line).split(' ').map(Number)
      ground.push({ x, y })
    }

    return { N, H, alpha, beta, ground }
  } catch (e) {
    return {}
  }
}

export const isMobile = () => /Mobi|Android/i.test(window?.navigator?.userAgent)

export const jsonInputToRaw = json => {
  const strings = [`${json.ground.length} ${json.height} ${json.alpha} ${json.beta}`]
  json.ground.forEach(ground => {
    strings.push(`${ground.x} ${ground.y}`)
  })
  return strings.join('\n')
}

const allDataIsInteger = data => {
  const isInteger = x => Math.round(x) === x
  const getValues = x => _.map(x, _.values)

  const { N, H, alpha, beta, ground } = data

  const allGroundXY = _.compose(_.flatten, getValues)(ground)
  const allNumbers = [N, H, alpha, beta].concat(allGroundXY)

  return _.every(allNumbers, isInteger)
}

export const getInputErrors = data => {
  const { N, H, alpha, beta, ground } = data

  if (!allDataIsInteger(data)) return 'All numbers must be integers'
  if (!(N >= 2 && N <= 10000)) return '$N$ (number of ground points) must satisfy $2 \\leq N \\leq 10^4$'
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
    if (!(x2 >= 0 && x2 <= 100000)) return xErr
  }

  for (let i = 0; i < ground.length; i++) {
    const y = ground[i].y
    if (!(y >= 0 && y < H)) return '$y$ values must satisfy $0 \\leq yi < h$'
  }

  return null
}

export const randomBridge = () => {
  const height = _.random(100, 200)
  const alpha = _.random(10, 100)
  const beta = _.random(10, 100)
  const N = _.random(30, 50)

  const ground = []
  let lastX = 0

  for (let i = 0; i < N; i++) {
    const newX = lastX + _.random(10, 20)
    const newY = _.random(0, height - 1)

    lastX = newX
    ground.push({
      x: newX,
      y: newY
    })
  }

  return {
    height,
    alpha,
    beta,
    ground
  }
}

export const deepClone = obj => JSON.parse(JSON.stringify(obj))
