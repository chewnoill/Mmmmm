import React from "react";
import { Global } from "@emotion/core";
import styled from "@emotion/styled";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/neat.css";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/markdown/markdown.js";
import "codemirror/mode/javascript/javascript.js";
import { Controlled as CodeMirror } from "react-codemirror2";
import Modal from "react-modal";
import useOnDrop from "hooks/use-on-drop";

const customStyles = {
  content: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    zIndex: 9999,
    padding: "0px"
  },
  overlay: {
    zIndex: 1
  }
};

const StyledCodeMirror = styled(CodeMirror)`
  .CodeMirror {
    height: 100%;
  }
`;

const CodeModal = ({
  value,
  setValue,
  isOpen,
  closeModal
}: {
  value: string;
  setValue: (v: string) => void;
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const onDrop = useOnDrop({
    callback: ({ id, fileName }) =>
      setValue(`${value}

<S3Thing id="${id}" fileName="${fileName}"/>

`)
  });
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Modal"
      style={customStyles}
      appElement={document.getElementById("root")!}
    >
      <Global
        styles={{
          body: {
            overflow: "hidden"
          }
        }}
      />
      <StyledCodeMirror
        value={value}
        options={{
          dragDrop: true,
          lineNumbers: true,
          mode: "markdown",
          blur: closeModal
        }}
        onBeforeChange={(editor, data, value) => {
          setValue(value);
        }}
        onDrop={onDrop}
      />
    </Modal>
  );
};

export default CodeModal;
