import * as React from 'react';

import { MainLayout } from '../src/aql/layout/MainLayout';
import { Staking } from '../src/aql/staking/Staking';

export default function StakingPage() {
  return <Staking />;
}

StakingPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
