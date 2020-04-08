import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

export const Flex = (props: any) => (
  <div
    css={{
      display: "flex"
    }}
    {...props}
  />
);

export const buttonStyles = css`
  button {
    font-size: 15px;
    cursor: pointer;
    border: none;
    outline: none;
    background: transparent;
  }

  button.primary {
    border: 2px solid black;
    padding: 5px 20px 5px 20px;
    transition: background ease 0.2s;
    background: white;
    :hover {
      background: gray;
    }
  }

  button.fill {
    height: 100%;
    width: 100%;
  }
`;

export const cardStyles = css`
  .card {
    border: 2px solid gray;
    border-radius: 8px;
    margin: 8px;
    padding: 8px;
  }
`;

export const rootStyles = css`
  ${buttonStyles}
  ${cardStyles}
`;

export const Div = styled.div(rootStyles);

export const Page = styled(Div)`
  min-height: 100vh;
  width: 100%;
`;
