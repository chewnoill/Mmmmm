import React from "react";
import styled from "@emotion/styled";
import { Div } from "ui";

const Button = styled.button`
  height: 40px;
  width: 40px;
`;

const PlusButton = ({ onClick }: { onClick: () => void }) => (
  <Button onClick={onClick}>
    <svg viewBox="0 0 48 48">
      <path
        d={`
M4 12 l40 0
M4 24 l40 0
M4 36 l40 0
            `}
        strokeWidth="4"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  </Button>
);

export default PlusButton;
