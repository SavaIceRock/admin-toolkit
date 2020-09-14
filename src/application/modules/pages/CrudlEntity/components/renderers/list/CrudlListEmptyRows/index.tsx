import React, { FC, memo } from 'react';
import { Placeholder } from '~/application/modules/pages/CrudlEntity/components/common/Placeholder';
import { TableCell, TableRow } from '@material-ui/core';

interface IProps {
  rows: number;
  cols: number;
}

const CrudlListEmptyRows: FC<IProps> = memo(({ rows, cols }) => (
  <>
    {[...new Array(rows)].map((_, i) => (
      <TableRow key={i}>
        {[...new Array(cols)].map((_, j) => (
          <TableCell key={j}>
            <Placeholder />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
));

export { CrudlListEmptyRows };
