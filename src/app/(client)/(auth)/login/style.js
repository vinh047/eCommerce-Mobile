"use client";
import styled from "styled-components";

export const WrapperContainerLeft = styled.div`
  flex: 1;
`;

export const WrapperContainerRight = styled.div`
  width: 300px;
  background: linear-gradient(
    135deg,
    rgb(240, 248, 255) -1%,
    rgb(219, 238, 255) 85%
  );
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
`;
export const WrapperText = styled.span`
  color: #2563eb;
  cursor: pointer;
`;
