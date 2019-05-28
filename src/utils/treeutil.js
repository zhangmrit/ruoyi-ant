
export function treeData (source, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  const cloneData = JSON.parse(JSON.stringify(source))// 对源数据深度克隆
  return cloneData.filter(father => {
    const branchArr = cloneData.filter(child => father[id] === child[parentId])// 返回每一项的子级数组
    if (branchArr.length > 0)father[children] = branchArr // 如果存在子级，则给父级添加一个children属性，并赋值
    return father[parentId] === rootId // 返回第一层
  })
}
