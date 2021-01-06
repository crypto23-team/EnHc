import React, { useMemo, useState } from 'react';
import { Card, Form, Table, Grid } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';

export default function Main(props) {
    const { api } = useSubstrate();
    const [blockInfo, setBlockInfo] = useState();
    const [searchValue, setSearchValue] = useState('');

    const getBlockInfo = async (blockHash) => {
        try {
            if (/^\s*$/.test(blockHash)) {
                setBlockInfo(null);
            }
            else {
                const hash = /^0x/.test(blockHash) ? blockHash : await api.rpc.chain.getBlockHash(blockHash);

                const block = await api.rpc.chain.getHeader(hash);

                if (typeof block.number === 'undefined') {
                    setBlockInfo(null);
                }
                else {
                    setBlockInfo(block);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onChangeHandler = (value) => {
        setSearchValue(value);
        getBlockInfo(value);
    };

    const searchBlock = useMemo(() => {
        return (
            <Grid.Column>
            {blockInfo && (
                <Table celled padded>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Number</Table.Cell>
                            <Table.Cell>{blockInfo.number.toNumber()}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Hash</Table.Cell>
                            <Table.Cell>{blockInfo.hash.toHex()}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Parent Hash</Table.Cell>
                            <Table.Cell>{blockInfo.parentHash.toHex()}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>State Root</Table.Cell>
                            <Table.Cell>{blockInfo.stateRoot.toHex()}</Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Extrinsics Root</Table.Cell>
                            <Table.Cell>{blockInfo.extrinsicsRoot.toHex()}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            )}
            </Grid.Column>
        );
        
    });

    return (
        <Grid.Column>
        <Card centered style={{ width: 'auto' }}>
            <Card.Content textAlign='center'>
                <Card.Header>Finalized Block Information</Card.Header>
                <Form style={{ marginTop: '10px' }}>
                    <Form.Input
                        size='large'
                        type='text'
                        placeholder='Enter block number(height) or hash to get information about a specific block'
                        value={searchValue}
                        onChange={(e, { value }) => {
                            onChangeHandler(value)
                        }}
                    />
                </Form>
                {searchBlock}
            </Card.Content>
        </Card>
        </Grid.Column>
    );
}