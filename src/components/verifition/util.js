export function resetSize (vm) {
  let imgWidth = vm.imgSize.width || 0
  let imgHeight = vm.imgSize.height || 0
  let barWidth = vm.barSize ? vm.barSize.width : 0
  let barHeight = vm.barSize ? vm.barSize.height	: 0// 图片的宽度、高度，移动条的宽度、高度

  const parentWidth = vm.$el.parentNode.offsetWidth || window.offsetWidth
  const parentHeight = vm.$el.parentNode.offsetHeight || window.offsetHeight

  if (vm.imgSize.width.indexOf('%') !== -1) {
    imgWidth = parseInt(vm.imgSize.width) / 100 * parentWidth + 'px'
  }

  if (vm.imgSize.height.indexOf('%') !== -1) {
    imgHeight = parseInt(vm.imgSize.height) / 100 * parentHeight + 'px'
  }

  if (vm.barSize && vm.barSize.width.indexOf('%') !== -1) {
    barWidth = parseInt(vm.barSize.width) / 100 * parentWidth + 'px'
  }

  if (vm.barSize && vm.barSize.height.indexOf('%') !== -1) {
    barHeight = parseInt(vm.barSize.height) / 100 * parentHeight + 'px'
  }

  return { imgWidth: imgWidth, imgHeight: imgHeight, barWidth: barWidth, barHeight: barHeight }
}

export const codeChars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
export const codeColor1 = ['#fffff0', '#f0ffff', '#f0fff0', '#fff0f0']
export const codeColor2 = ['#FF0033', '#006699', '#993366', '#FF9900', '#66CC66', '#FF33CC']
