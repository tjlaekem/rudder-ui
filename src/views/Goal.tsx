import { useMutation } from '@apollo/client';
import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import { mutations } from 'api';
import Button from 'components/Button';
import Checkbox from 'components/Form/Checkbox';
import Input from 'components/Form/Input';
import { Goal as GoalType } from 'types';

const Wrapper = styled.div`
  align-items: center;
  display: grid;
  grid-area: 'text';
  grid-gap: 16px;
  grid-template-areas: 'checkbox text save cancel';
  grid-template-columns: max-content 1fr max-content max-content;
  justify-items: start;
`;

type propTypes = {
  goal: GoalType;
  sprint: string;
};

const Goal: FunctionComponent<propTypes> = ({ goal, sprint }: propTypes) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateGoal] = useMutation<{ updateGoal: GoalType }>(
    mutations.updateGoal
  );
  return (
    <Wrapper>
      <Checkbox
        area="checkbox"
        id={goal.id}
        onChange={(value) =>
          updateGoal({
            variables: { goal: goal.id, sprint, isAchieved: value },
          })
        }
        value={goal.isAchieved}
      />
      {isEditing ? (
        <>
          <Input area="text" value={goal.text} />
          <Button area="save" onClick={() => setIsEditing(false)}>
            Save
          </Button>
          <Button area="cancel" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <Button onClick={() => setIsEditing(true)}>{goal.text}</Button>
      )}
    </Wrapper>
  );
};

export default Goal;
