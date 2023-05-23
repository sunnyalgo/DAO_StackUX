import * as React from 'react';

import { MainLayout } from '../src/aql/layout/MainLayout';
import { Liquidity } from '../src/aql/liquidity/Liquidity';

export default function LiquidityPage() {
  return <Liquidity />;
}

LiquidityPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
