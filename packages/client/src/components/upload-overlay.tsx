import React from "react";
import styled from "@emotion/styled";

const Modal = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: tomato;

  .flex {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    position: relative;
  }

  .message {
    width: 100%;
    text-align: center;
  }
`;

const UploadOverlay = ({ children }: { children?: React.ReactNode }) => (
  <Modal>
    <div className="flex">
      <div className="message">Drop a file to upload a new thing...</div>
      {children}
    </div>
  </Modal>
);

export default UploadOverlay;
