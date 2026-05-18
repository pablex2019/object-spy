const { chromium } = require('playwright');
const {
  buildCssSelector,
  buildXPath,
} = require('./selectorUtils');

async function inspectPage(url) {
  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage();

  try {
    // Navegar al sitio
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Obtener título
    const title = await page.title();

    // Extraer elementos relevantes
    const rawElements = await page
      .locator('input, button, select, textarea, a')
      .evaluateAll((nodes) =>
        nodes.map((node) => ({
          tag: node.tagName.toLowerCase(),
          id: node.id || '',
          name: node.getAttribute('name') || '',
          type: node.getAttribute('type') || '',
          text: (node.innerText || node.value || '').trim(),
          placeholder: node.getAttribute('placeholder') || '',
          className: node.className || '',
          href: node.getAttribute('href') || '',
          value: node.getAttribute('value') || '',
          ariaLabel: node.getAttribute('aria-label') || '',
          dataTestId:
            node.getAttribute('data-testid') ||
            node.getAttribute('data-test') ||
            '',
        }))
      );

    // Filtrar elementos poco útiles
    const filteredElements = rawElements.filter((el) => {
      return (
        el.id ||
        el.name ||
        el.text ||
        el.placeholder ||
        el.dataTestId
      );
    });

    // Enriquecer con selectores
    const elements = filteredElements.map((el) => ({
      ...el,
      cssSelector: buildCssSelector(el),
      xpath: buildXPath(el),
      playwrightSelector:
        el.dataTestId
          ? `[data-testid="${el.dataTestId}"]`
          : buildCssSelector(el),
    }));

    return {
      title,
      url,
      totalElements: elements.length,
      elements,
    };
  } finally {
    await browser.close();
  }
}

module.exports = {
  inspectPage,
};