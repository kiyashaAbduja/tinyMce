import React, { useEffect } from "react";

const CopyPasteRestrictionComponent = () => {
  useEffect(() => {
    const encodeText = (text) => {
      return `EXAM_COPY:${btoa(text)}`;
    };

    const decodeText = (text) => {
      if (text.startsWith("EXAM_COPY:")) {
        return atob(text.replace("EXAM_COPY:", ""));
      }
      return text;
    };

    const handleCopy = (e) => {
      const selectedText = window.getSelection().toString();
      const encodedText = encodeText(selectedText);

      // Set the modified clipboard data
      e.clipboardData.setData("text/plain", encodedText);
      e.preventDefault();
    };

    const handlePaste = (e) => {
      const pastedText = e.clipboardData.getData("text/plain");

      // Decode the text if it has the marker
      if (pastedText.startsWith("EXAM_COPY:")) {
        const decodedText = decodeText(pastedText);

        // Insert the decoded text into the target input
        const input = e.target;
        if (
          input.tagName.toLowerCase() === "textarea" ||
          input.tagName.toLowerCase() === "input"
        ) {
          const start = input.selectionStart;
          const end = input.selectionEnd;
          const textBefore = input.value.substring(0, start);
          const textAfter = input.value.substring(end);
          //   input.value = textBefore + decodedText + textAfter;
          input.value = decodedText + textAfter;
          input.selectionStart = input.selectionEnd =
            start + decodedText.length;

          console.log(textBefore + decodedText + textAfter);
          console.log(textBefore, "textBefore");
          console.log(textAfter, "textAfter");
          console.log(decodedText, "decodedText");
        } else {
          document.execCommand("insertText", false, decodedText);
        }

        e.preventDefault();
      } else {
        e.preventDefault();
        alert("Pasting content from outside the exam is not allowed!");
      }
    };

    // Disable right-click context menu
    document.addEventListener("contextmenu", (e) => e.preventDefault());

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", (e) => e.preventDefault());
    };
  }, []);

  return (
    <div className="App">
      <h1>Exam Interface</h1>
      <div className="question-section">
        <p className="allow-copy">Question 1: What is React?</p>
        <p className="allow-copy">
          Question 2: Explain the use of the useState hook.
        </p>
      </div>
      <div className="answer-section">
        <textarea
          rows="4"
          cols="50"
          placeholder="Answer for Question 1"
        ></textarea>
        <textarea
          rows="4"
          cols="50"
          placeholder="Answer for Question 2"
        ></textarea>
      </div>
    </div>
  );
};

export default CopyPasteRestrictionComponent;
