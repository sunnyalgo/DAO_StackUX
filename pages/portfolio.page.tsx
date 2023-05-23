import * as React from 'react';
import { Portfolio } from 'src/aql/portfolio/Portfolio';

import { MainLayout } from '../src/aql/layout/MainLayout';

export default function PortfolioPage() {
  return <Portfolio />;
}

PortfolioPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
