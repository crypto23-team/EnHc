import React, { useState } from 'react';
import { Button, Form, Grid, Icon, Input, Label } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

export default function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // Currently stored values
  const [formState, setFormState] = useState({ multiRan: "", signatories: "", vgfcd: "", threshold: 0, amount: 0 });

  const onChange = (_, data) =>
  setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const { multiRan, signatories, vgfcd, threshold, amount } = formState;

  const UNIT = 1000000000000;

  const onSubmit = async () => {
    const tx = api.tx.balances.transfer(vgfcd, amount);
    const data = tx.method.toHex();
    const hash = tx.method.hash;

    const multisig = await api.query.multisig.multisigs(multiRan, hash);

    if (multisig.isSome) {
      const timepoint = multisig.unwrap().when;

      api.tx.multisig.asMulti(threshold, signatories.split(','), timepoint, data, false, UNIT)
      .signAndSend(accountPair);
    } 
    else {
      api.tx.multisig.approveAsMulti(threshold, signatories.split(','), null, hash, UNIT)
        .signAndSend(accountPair);
    }
  }

  return (
    <Grid.Column width={8}>
      <h1>Multisig Transfer</h1>
      <Form>
        <Form.Field>
          <Label basic color='teal'>
            <Icon name='hand point right' />
            1 Unit = {UNIT}
          </Label>
        </Form.Field>
        <Form.Field>
          <Input
            label='Multisig address'
            state='multiRan'
            type='text'
            placeholder='Address'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label='Other signatories'
            state='signatories'
            type='text'
            placeholder='address1, address2'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label='Transfer To'
            state='vgfcd'
            type='text'
            placeholder='Address'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label='Threshold'
            state='threshold'
            type='number'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Transfer amount'
            state='amount'
            type='number'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <Button
            label='Submit'
            type='SIGNED-TX'
            onClick={onSubmit}
          />
        </Form.Field>
      </Form>
    </Grid.Column>
  );
}