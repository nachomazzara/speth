export async function resolveInBatch<T>(
  promises: Promise<any>[],
  batchNumber = 5
): Promise<T[]> {
  let i = 0

  if (promises.length < batchNumber) {
    batchNumber = promises.length
  }

  const responses: T[] = []

  const wrappedPromises = wrapBatchPromise(promises)

  while (i < wrappedPromises.length) {
    const res = await Promise.all(wrappedPromises.slice(i, i + batchNumber))
    responses.push(...res)
    i += batchNumber
  }

  return responses
}

export function wrapBatchPromise<T>(
  promises: Promise<T>[]
): Promise<T | null>[] {
  return promises.map((promise) => {
    return promise
      .then((res) => res)
      .catch((e) => {
        console.warn('Failed to resolve promise', e.message)
        return null
      })
  })
}
