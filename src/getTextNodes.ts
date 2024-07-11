export const getTextNodes = (id: string, excludeChildIds?: string[]) => {
  const element = document.getElementById(id);
  const array = new Array<{ node: Node; parent: HTMLElement | null }>();

  const recursivelyFillSetWithTextNodes = (node: Node | null) => {
    if (node?.nodeType === Node.TEXT_NODE) {
      array.push({ node, parent: node.parentElement });
    } else {
      node?.childNodes.forEach((each) => {
        // check node contains id "test"
        if (each instanceof HTMLElement && excludeChildIds?.includes(each.id)) {
          // do nothing
        } else {
          recursivelyFillSetWithTextNodes(each);
        }
      });
    }
  };
  recursivelyFillSetWithTextNodes(element);

  return array;
};
