import * as React from 'react';
import { Info } from 'src/aql/info/Info';

import { MainLayout } from '../src/aql/layout/MainLayout';

export default function InfoPage() {
  return <Info />;
}

InfoPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
