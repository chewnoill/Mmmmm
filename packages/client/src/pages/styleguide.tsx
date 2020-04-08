import React from "react";
import { styled } from "ui";

const StyleGuide = styled.div`
  button.primary {
  }


}
`;

export default () => (
  <StyleGuide className="flex flex-column">
    <div className="flex items-end">
      <h1>h1</h1>
      <h2>h2</h2>
      <h3>h3</h3>
      <h4>h4</h4>
      <span className="f1">f1</span>
      <span className="f2">f2</span>
      <span className="f3">f3</span>
      <span className="f4">f4</span>
    </div>
    <div>
      <button className="primary">123</button>
    </div>
    <h1>Card:</h1>
    <div className="card f1">
      whaaaat
      <span className="f2">123</span>
      456
    </div>
  </StyleGuide>
);
