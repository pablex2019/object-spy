function generatePlaywrightScript(elements) {
  const lines = [];

  const username = elements.find(
    (el) =>
      (el.id || '').toLowerCase().includes('user') ||
      (el.name || '').toLowerCase().includes('user')
  );

  const password = elements.find(
    (el) =>
      el.type === 'password' ||
      (el.id || '').toLowerCase().includes('pass') ||
      (el.name || '').toLowerCase().includes('pass')
  );

  const submitButton = elements.find(
    (el) =>
      el.tag === 'button' ||
      el.type === 'submit'
  );

  if (username) {
    lines.push(
      `await page.fill('${username.cssSelector}', 'usuario');`
    );
  }

  if (password) {
    lines.push(
      `await page.fill('${password.cssSelector}', 'password');`
    );
  }

  if (submitButton) {
    lines.push(
      `await page.click('${submitButton.cssSelector}');`
    );
  }

  return lines.join('\n');
}

module.exports = {
  generatePlaywrightScript,
};