import React, { useEffect, useState } from 'react';
import { Card, Table, Grid } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';

export default function Main(props) {
    const { api } = useSubstrate();
    const [blockInfo, setBlockInfo] = useState();

    useEffect(() => {
        let unsubscribeAll = null;

        const getBlockInfo = async () => {
            api.rpc.chain.subscribeNewHeads((header) => {
                setBlockInfo(header);
            });
        };
        getBlockInfo();

        return () => unsubscribeAll && unsubscribeAll()
    }, []);

    return (
        <Grid.Column>
        <Card centered style={{ width: 'auto' }}>
            <Card.Content textAlign='center'>
                <Card.Header>Current Block Information</Card.Header>
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
            </Card.Content>
        </Card>
        </Grid.Column>
    );
}