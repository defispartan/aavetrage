import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="https://github.com/austintgriffith/scaffold-eth" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🏗 AAVEtrage"
        subTitle="Perform stablecoin interest rate arbitrage on AAVE"
        style={{ cursor: "pointer", paddingTop: '50px' }}
      />
    </a>
  );
}
