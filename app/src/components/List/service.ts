export const returnData = (lists: ApparatusList.ListData[]) =>
  lists.map((list: ApparatusList.ListData) => createData({ ...list }));

export function createData({
  id,
  name,
  description,
  targets,
}: ApparatusList.ListData) {
  return {
    id,
    name,
    description,
    targets_count: targets.length,
  };
}

export const createHighlightedDomElement = (): HTMLSpanElement => {
  let highlight = document.createElement("span");
  highlight.setAttribute("class", "highlight-red");
  return highlight;
};

export const extractTexts = (childNodes: NodeListOf<ChildNode>): string =>
  Array.prototype.reduce.call(
    childNodes,
    (result, node) =>
      result + ((node.innerHTML ?? "") || (node.nodeValue ?? "")),
    ""
  ) as string;

export const proceedHighlightText = (): Range | undefined => {
  let selection = window.getSelection();
  const selectedRange = selection?.getRangeAt(0);
  if (
    !(
      selectedRange?.commonAncestorContainer?.nodeName === "#text" ||
      (selectedRange?.commonAncestorContainer as HTMLElement).className?.includes(
        "highlightable"
      )
    )
  ) {
    return;
  }
  return selectedRange;
};

export const cleanUpHighlights = () =>
  Array.from(document.querySelectorAll("span.highlight-red")).forEach(
    (element: any) => {
      if (element.querySelector("span.highlight-red") !== null)
        element.innerHTML = extractTexts(element.childNodes!);
      if (element.innerHTML === "") element.remove();
    }
  );

export const highlightText = (selectedRange: Range) => {
  const domFragment = selectedRange?.extractContents();
  if (domFragment?.childNodes.length === 0) return;

  const highlight = createHighlightedDomElement();
  highlight.innerHTML = extractTexts(domFragment?.childNodes!);
  selectedRange?.insertNode(highlight!);

  cleanUpHighlights();
};

export interface IPiePosition {
  start: number;
  end: number;
}

export const unHighlightText = (selectedRange: Range) => {
  const commonParent = selectedRange.commonAncestorContainer?.parentElement;
  if (commonParent?.className.includes("highlight-red")) {
    const beginSelectionPoint: number = selectedRange.startOffset;
    const endSelectionPoint: number = selectedRange.endOffset;
    const firstJoint: number =
      beginSelectionPoint < endSelectionPoint
        ? beginSelectionPoint
        : endSelectionPoint;
    const secondJoint: number =
      beginSelectionPoint < endSelectionPoint
        ? endSelectionPoint
        : beginSelectionPoint;
    const firstPie: IPiePosition = { start: 0, end: firstJoint };
    const middlePie: IPiePosition = { start: firstJoint, end: secondJoint };
    const lastPie: IPiePosition = {
      start: secondJoint,
      end: commonParent.innerText.length,
    };

    const fragment = new DocumentFragment();
    const firstPieDom = createHighlightedDomElement();
    firstPieDom.innerText = commonParent.innerText.slice(
      firstPie.start,
      firstPie.end
    );
    const middlePieDom = document.createTextNode(
      commonParent.innerText.slice(middlePie.start, middlePie.end)
    );
    const lastPieDom = createHighlightedDomElement();
    lastPieDom.innerText = commonParent.innerText.slice(
      lastPie.start,
      lastPie.end
    );
    for (const node of [firstPieDom, middlePieDom, lastPieDom]) {
      fragment.appendChild(node);
    }
    commonParent.replaceWith(fragment);
  } else {
    const domFragment = selectedRange?.extractContents();
    if (domFragment?.childNodes.length === 0) return;
    selectedRange.insertNode(
      document.createTextNode(extractTexts(domFragment?.childNodes!))
    );
  }

  cleanUpHighlights();
};

export const extractHighlightedTextIndexes = (
  childNodes: NodeListOf<ChildNode>
) => {
  let acummulatedIndex: number = -1;
  let highlightTextIndexes: Array<{ start: number; end: number }> = [];
  for (const node of Array.from(childNodes)) {
    if (node?.nodeName === "#text") {
      acummulatedIndex += node.nodeValue?.length ?? 0;
    } else if ((node as HTMLElement).className?.includes("highlight-red")) {
      const textLength = (node as HTMLElement).innerText.length ?? 0;
      highlightTextIndexes.push({
        start: acummulatedIndex + 1,
        end: acummulatedIndex + textLength,
      });
      acummulatedIndex += textLength;
    } else {
      console.log("ERROR: unexpected node");
    }
  }
  return highlightTextIndexes;
};
