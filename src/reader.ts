import { getTextNodes } from "./getTextNodes";

export function Reader({
  excludeChildIds,
  onStop,
  onStart,
}: {
  onStop: () => void;
  onStart: () => void;
  excludeChildIds?: string[];
}) {
  let reading = false;
  let utterance: SpeechSynthesisUtterance | null = null;
  let previousNode:
    | { node: Node; parent: HTMLElement | null }
    | null
    | undefined;
  let highlightedNode: HTMLSpanElement | null | undefined;

  if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onerror = (e) => {
      reading = false;
    };

    utterance.onstart = () => {
      reading = true;
    };

    // Get the word of a string given the string and index
    const voices = speechSynthesis.getVoices();
    utterance.voice =
      voices.find(
        (voice) => voice.lang === "en-US" && voice.name === "Samantha",
      ) ??
      voices.find((voice) => voice.lang === "en-US") ??
      speechSynthesis.getVoices()[0];
  } else {
    return {
      available: false,
      startRead: () => {},
      stopRead: () => {},
    };
  }

  function reset() {
    if (previousNode && highlightedNode) {
      try {
        previousNode.parent?.replaceChild(previousNode.node, highlightedNode);
      } catch (e) {
        // do nothing
      }
    }

    previousNode = undefined;
    highlightedNode = null;
  }

  function readText(id: string) {
    if (!utterance) {
      return;
    }

    const array = getTextNodes(id, excludeChildIds);
    const readNext = () => {
      if (array.length > 0) {
        if (previousNode && highlightedNode) {
          previousNode.parent?.replaceChild(previousNode.node, highlightedNode);
        }

        const textContent = array[0].node.textContent;
        if (textContent && utterance) {
          // remove the node
          utterance.text = textContent;
          highlightedNode = document.createElement("span");
          highlightedNode.textContent = textContent;

          array[0].parent?.replaceChild(highlightedNode, array[0].node);

          if (array[0].node.textContent?.trim().includes(" ")) {
            utterance.onboundary = (event) => {
              if (event.name === "word") {
                const initialIndex =
                  textContent.substring(0, event.charIndex) ?? "";
                const word = textContent.substring(
                  event.charIndex,
                  event.charIndex + event.charLength,
                );
                const rest = textContent.substring(
                  event.charIndex + event.charLength,
                );

                const textNode = document.createTextNode(initialIndex);
                const wordNode = document.createElement("mark");
                wordNode.textContent = word;
                wordNode.className = "reading-word";
                const restNode = document.createTextNode(rest);

                if (
                  highlightedNode?.childNodes.length === 1 &&
                  highlightedNode.firstChild
                ) {
                  highlightedNode.replaceChild(
                    wordNode,
                    highlightedNode.firstChild,
                  );
                  highlightedNode.appendChild(restNode);
                } else if (highlightedNode?.childNodes.length === 2) {
                  highlightedNode.replaceChild(
                    textNode,
                    highlightedNode.childNodes[0],
                  );
                  highlightedNode.replaceChild(
                    wordNode,
                    highlightedNode.childNodes[1],
                  );
                  highlightedNode.appendChild(restNode);
                } else if (highlightedNode) {
                  highlightedNode.replaceChild(
                    textNode,
                    highlightedNode.childNodes[0],
                  );
                  highlightedNode.replaceChild(
                    wordNode,
                    highlightedNode.childNodes[1],
                  );
                  highlightedNode.replaceChild(
                    restNode,
                    highlightedNode.childNodes[2],
                  );
                }
              }
            };
          } else {
            utterance.onboundary = null;
            highlightedNode.textContent = textContent;
            highlightedNode.className = "reading-word";
          }
          speechSynthesis.speak(utterance);
        }

        previousNode = array.shift();
      } else {
        if (previousNode && highlightedNode) {
          previousNode.parent?.replaceChild(previousNode.node, highlightedNode);
        }
      }
    };

    utterance.onend = () => {
      if (reading) {
        setTimeout(() => {
          readNext();
        }, 100);
      }

      if (array.length === 0) {
        // no more text to read
        onStop();
        reset();
      }
    };

    readNext();
  }

  function startRead(id: string, prefix?: string) {
    if (!utterance) {
      return;
    }

    onStart();
    reading = true;
    if (prefix) {
      utterance.text = prefix;
      utterance.onend = () => {
        if (utterance) {
          utterance.onend = null;
        }
        readText(id);
      };
      speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        readText(id);
      }, 100);
    }
  }

  function stopRead() {
    reset();
    onStop();
    reading = false;
    if ("speechSynthesis" in window && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  }

  return {
    available: true,
    startRead,
    stopRead,
  };
}
