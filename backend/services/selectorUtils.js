function buildCssSelector(element) {
  if (element.id) return `#${element.id}`;
  if (element.name) return `[name="${element.name}"]`;
  if (element.className) {
    const firstClass = element.className.split(' ')[0];
    return `${element.tag}.${firstClass}`;
  }
  return element.tag;
}

function buildXPath(element) {
  if (element.id) return `//*[@id="${element.id}"]`;
  if (element.name) return `//*[@name="${element.name}"]`;
  if (element.text && element.tag === 'button') {
    return `//button[contains(text(),"${element.text}")]`;
  }
  return `//${element.tag}`;
}

module.exports = { buildCssSelector, buildXPath };