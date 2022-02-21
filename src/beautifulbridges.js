const sqrt = Math.sqrt
const pow = Math.pow
const abs = Math.abs

function beautifulBridgesSolver (N, H, alpha, beta, ground) {
  const arcLeftMax = new Array(N)
  const arcRightMax = new Array(N)
  const memo = new Array(N)
  const solution = new Array(N)

  const dist = (i, j) => abs(ground[i].x - ground[j].x)
  const pillarHeight = i => H - ground[i].y
  const costPillar = i => alpha * pillarHeight(i)
  const costArc = (i, j) => beta * pow(dist(i, j), 2)

  const arcPossible = (i, j) => {
    const arcRadius = dist(i, j) / 2
    return arcRightMax[i] >= arcRadius && arcLeftMax[j] >= arcRadius
  }

  const precomputeArcBoundsRight = point => {
    let r = pillarHeight(point)
    for (let i = point + 1; i < N; i++) {
      const centerX = ground[point].x + r
      const centerY = H - r
      if (centerX < ground[i].x) break
      const circleY = sqrt(pow(r, 2) - pow(ground[i].x - centerX, 2)) + centerY
      if (circleY > ground[i].y) continue
      const [L, X, Y] = [ground[point].x, ground[i].x, ground[i].y]
      r = H - L + X - Y + sqrt(2) * sqrt(-H * L + H * X + L * Y - X * Y)
    }

    arcRightMax[point] = r
  }

  const precomputeArcBoundsLeft = point => {
    let r = pillarHeight(point)
    for (let i = point - 1; i >= 0; i--) {
      const centerX = ground[point].x - r
      const centerY = H - r
      if (ground[i].x < centerX) break
      const circleY = sqrt(pow(r, 2) - pow(ground[i].x - centerX, 2)) + centerY
      if (circleY > ground[i].y) continue
      const [R, X, Y] = [ground[point].x, ground[i].x, ground[i].y]
      r = H + R - X - Y + sqrt(2) * sqrt(H * R - H * X - R * Y + X * Y)
    }

    arcLeftMax[point] = r
  }

  const collectSolution = solutionFlagArray => {
    const solutionArcs = []

    for (let i = 0; i < solutionFlagArray.length; i++) {
      if (solutionFlagArray[i]) solutionArcs.push(i)
    }

    return solutionArcs
  }

  const dp = n => {
    if (n === N - 1) return costPillar(n)
    if (memo[n] !== -1) return memo[n]

    let minCost = Infinity
    let nextArc = null

    for (let i = n + 1; i < N; i++) {
      if (arcPossible(n, i)) {
        const cost = costPillar(n) + costArc(n, i) + dp(i)
        if (cost < minCost) {
          nextArc = i
          minCost = cost
        }
      }
    }

    if (nextArc !== null) {
      solution[nextArc] = true
    }

    memo[n] = minCost
    return minCost
  }

  for (let i = 1; i < N; i++) precomputeArcBoundsLeft(i)
  for (let i = 0; i < N - 1; i++) precomputeArcBoundsRight(i)
  for (let i = 0; i < N; i++) {
    memo[i] = -1
    solution[i] = false
  }

  solution[0] = true
  solution[N - 1] = true

  // Avoid stack overflow error.
  for (let i = N - 1; i >= 0; i--) {
    dp(i)
  }

  const cost = dp(0)

  return {
    cost,
    H,
    ground,
    solution: cost === Infinity ? [] : collectSolution(solution)
  }
}

module.exports = {
  beautifulBridgesSolver
}
