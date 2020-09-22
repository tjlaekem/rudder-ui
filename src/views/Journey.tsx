import { useMutation, useQuery } from '@apollo/client';
import React, { FunctionComponent, useEffect } from 'react';
import styled from 'styled-components';

import { mutations, queries } from 'api';
import LoadingIndicator from 'components/LoadingIndicator';
import useHasFinished from 'hooks/useHasFinished';
import type { Goal as GoalType, Sprint as SprintType } from 'types';
import { isSprintActive } from 'utils/date';

const Journey: FunctionComponent = () => {
  const { data, loading: isLoading } = useQuery(queries.getSprints);
  const [deleteSprints, { loading: isDeleting }] = useMutation<{
    deleteSprints: string;
  }>(mutations.deleteSprints);

  const hasDeleted = useHasFinished(isDeleting);
  const unsortedSprints = data?.sprints || [];

  const filteredSprints = unsortedSprints.filter(
    (sprint: SprintType) => sprint.goals.length > 0 || isSprintActive(sprint)
  );

  const sprints = filteredSprints.sort((a: SprintType, b: SprintType) =>
    new Date(a.endDate) < new Date(b.endDate) ? 1 : -1
  );

  const emptySprintIds = unsortedSprints
    .filter((sprint: SprintType) => sprint.goals.length === 0)
    .map((sprint: SprintType) => sprint.id);

  const hasEmptySprints = emptySprintIds.length > 0;

  useEffect(() => {
    if (hasEmptySprints && !isDeleting && !hasDeleted) {
      deleteSprints({
        awaitRefetchQueries: true,
        refetchQueries: [{ query: queries.getSprints }],
        variables: { sprints: emptySprintIds },
      });
    }
  }, [deleteSprints, emptySprintIds, hasDeleted, hasEmptySprints, isDeleting]);

  if (isLoading || hasEmptySprints) return <LoadingIndicator />;

  return (
    <>
      <Title>Where you&apos;ve been</Title>
      <List>
        {sprints.map((sprint: SprintType) => (
          <Item key={sprint.id}>
            <EndDate>{sprint.endDate}</EndDate>
            {isSprintActive(sprint) ? (
              <Goals>
                {`${
                  sprint.goals.filter((goal: GoalType) => goal.isAchieved)
                    .length
                } of ${sprint.goals.length} goals achieved`}
              </Goals>
            ) : (
              <Goals>
                {`${
                  sprint.goals.filter((goal: GoalType) => goal.isAchieved)
                    .length
                } goals achieved`}
              </Goals>
            )}
          </Item>
        ))}
      </List>
    </>
  );
};

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 40px;
`;

const List = styled.ul`
  list-style-type: none;
`;

const Item = styled.li`
  align-items: baseline;
  border-bottom: dotted ${({ theme }) => theme.colours.border.divider} 1px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 10px 0;
`;

const EndDate = styled.h3`
  color: ${({ theme }) => theme.colours.text.normal};
  font-size: 1.1rem;
`;

const Goals = styled.p`
  color: ${({ theme }) => theme.colours.text.weak};
  font-weight: 400;
`;

export default Journey;
