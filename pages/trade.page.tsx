import * as React from 'react';
import { Trade } from 'src/aql/trade/Trade';

import { MainLayout } from '../src/aql/layout/MainLayout';

export default function TradePage() {
  return <Trade />;
}

TradePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
