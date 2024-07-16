export function parseTree<T extends Record<string, any>, K extends keyof any>(
  data: T[],
  getId: (item: T) => K,
  getParentId: (item: T) => K,
  extraData: (item: T) => Record<string, any>,
) {
  const keyNodes = new Map<K, T & { children?: T[] }>()
  const rootNodes: (T & { children?: T[] })[] = []

  const nodeList = data.map((item) => {
    const key = getId(item)
    const node = { ...item }
    keyNodes.set(key, node as T & { children?: T[] })
    return node
  })
  nodeList.forEach((item) => {
    const parentKey = getParentId(item)
    const parent = keyNodes.get(parentKey)
    if (parent) {
      if (!parent.children?.length) parent.children = []
      parent.children.push(item)
    } else {
      rootNodes.push(item as T & { children?: T[] })
    }
  })

  keyNodes.forEach((item) => {
    const extra = extraData(item)
    Object.keys(extra).forEach((key) => {
      const node = item as any
      node[key] = extra[key]
    })
  })
  return rootNodes
}

export function getPath<T>(
  data: T[],
  getId: (item: T) => string | number,
  getParentId: (item: T) => string | number,
  id: string | number,
  path: T[] = [],
) {
  const current = data?.find((item) => getId(item) === id)
  if (!current) return path
  path.push(current)
  const parent = data?.find((item) => getId(item) === getParentId(current))
  if (!parent) return path.reverse()
  return getPath(data, getId, getParentId, getId(parent), path)
}
