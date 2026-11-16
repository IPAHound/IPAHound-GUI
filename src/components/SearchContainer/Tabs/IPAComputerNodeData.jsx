import React, { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import CollapsibleSection from './Components/CollapsibleSection';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherNoNumberLink from './Components/NodeCypherNoNumberLink';
import MappedNodeProps from './Components/MappedNodeProps';
import ExtraNodeProps from './Components/ExtraNodeProps';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import { Table } from 'react-bootstrap';
import styles from './NodeData.module.css';
import { AppContext } from '../../../AppContext';

const IPAComputerNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectid, setObjectid] = useState(null);
    const [label, setLabel] = useState(null);
    const [domain, setDomain] = useState(null);
    const [nodeProps, setNodeProps] = useState({});
    const context = useContext(AppContext);

    useEffect(() => {
        emitter.on('nodeClicked', nodeClickEvent);

        return () => {
            emitter.removeListener('nodeClicked', nodeClickEvent);
        };
    }, []);

    const nodeClickEvent = (type, id, blocksinheritance, domain) => {
        if (type === 'IPAComputer') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(
                    `MATCH (n:IPAComputer {objectid: $objectid}) RETURN n AS node`,
                    {
                        objectid: id,
                    }
                )
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name || props.azname || objectid);
                    session.close();
                });
        } else {
            setObjectid(null);
            setVisible(false);
        }
    };

    const displayMap = {
        objectid: 'Object ID',
        nsOsVersion: 'OS',
        enabled: 'Enabled',
        unconstraineddelegation: "Allows Unconstrained Delegation",
        ipakrboktoauthasdelegate: "Trusted to authenticate as user",
        owned: 'Compromised',
        serverHostName: 'Host name',
        krbLastPwdChange: 'Password Last Changed',
        managedBy: 'Manage by',
    };

    return objectid === null ? (
        <div></div>
    ) : (
        <div
            className={clsx(
                !visible && 'displaynone',
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <div className={clsx(styles.dl)}>
                <h5>{label || objectid}</h5>

                <CollapsibleSection header='OVERVIEW'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Reachable High Value Targets'
                                target={objectid}
                                baseQuery={
                                    'MATCH (m:IPAComputer {objectid: $objectid}),(n {highvalue:true}),p=shortestPath((m)-[r*1..]->(n)) WHERE NONE (r IN relationships(p) WHERE type(r)= "GetChanges") AND NONE (r in relationships(p) WHERE type(r)="GetChangesAll") AND NOT m=n'
                                }
                                start={label}
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <MappedNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />
                <ExtraNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <CollapsibleSection header={'GROUP MEMBERSHIP'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Unrolled Group Membership'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(c:IPAComputer {objectid: $objectid})-[r:MemberOf*1..]->(n:IPAGroup)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header={'OUTBOUND SSH RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Explicit SSH Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[b:CanSSH]->(c:IPAComputer {objectid: $objectid})'
                                }
                                end={label}
                            />
                            <NodeCypherLink
                                property='Unrolled SSH Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH (m:IPAComputer {objectid: $objectid})\n' +
                                    'MATCH p = (n)-[:MemberOf|AddMember*0..]->()-[:CanSSH*1..]->()<-[:MemberOf*0..]-(m)'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header={'OUTBOUND SUDO RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Explicit Sudo Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[b:CanSUDO]->(c:IPAComputer {objectid: $objectid})'
                                }
                                end={label}
                            />
                            <NodeCypherLink
                                property='Unrolled Sudo Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[:MemberOf|AddMember*0..]->()-[:CanSUDO*1..]->()<-[:MemberOf*0..]-(m:IPAComputer {objectid: $objectid}) WHERE NOT n:Group'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header={'INBOUND CONTROL RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Explicit Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[r]->(u1:IPAComputer {objectid:$objectid}) WHERE r.isacl=true'
                                }
                                end={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((n)-[r1*1..]->(u1:IPAComputer {objectid:$objectid}))'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header='OUTBOUND OBJECT CONTROL'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (c:IPAComputer {objectid: $objectid})-[r]->(n) WHERE r.isacl=true'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((c:IPAComputer {objectid: $objectid})-[r*1..]->(n))'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>
                {/* <Notes objectid={objectid} type='Computer' />
                <NodeGallery
                    objectid={objectid}
                    type='Computer'
                    visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAComputerNodeData.propTypes = {};
export default IPAComputerNodeData;
