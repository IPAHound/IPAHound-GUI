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

const IPAServiceNodeData = () => {
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
        if (type === 'IPAService') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(
                    `MATCH (n:IPAService {objectid: $objectid}) RETURN n AS node`,
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
        krbCanonicalName: 'Display Name',
        objectid: 'Object ID',
        krbLastPwdChange: 'Password Last Changed',
        enabled: 'Enabled',
        managedBy: 'Managed By',
        owned: 'Compromised',
        serviceprincipalnames: 'Service Principal Names',
        KrbAllowedToDelegateTo: 'Allowed To Delegate',
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
                                    'MATCH (m:IPAService {objectid: $objectid}),(n {highvalue:true}),p=shortestPath((m)-[r*1..]->(n)) WHERE NONE (r IN relationships(p) WHERE type(r)= "GetChanges") AND NONE (r in relationships(p) WHERE type(r)="GetChangesAll") AND NOT m=n'
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
                                    'MATCH p=(c:IPAService {objectid: $objectid})-[r:MemberOf*1..]->(n:IPAGroup)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header={'SSH RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree SSH rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAService {objectid: $objectid})-[r:CanSSH]-(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            <NodeCypherLink
                                property='Group Delegated SSH rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAService {objectid: $objectid})-[r1:MemberOf*1..]->(g:IPAGroup)-[r2:CanSSH]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Unrolled SSH rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAService {objectid: $objectid})-[r1:MemberOf*0..]->()-[r2:CanSSH]->()<-[r3:MemberOf*0..]-(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'SUDO RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Sudo rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAService {objectid: $objectid})-[r:CanSUDO]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            <NodeCypherLink
                                property='Group Delegated Sudo rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAService {objectid: $objectid})-[r1:MemberOf*1..]->(g:IPAGroup)-[r2:CanSUDO]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Unrolled Sudo rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAService {objectid: $objectid})-[r1:MemberOf*0..]->()-[r2:CanSUDO]->()<-[r3:MemberOf*0..]-(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header={'SERVICE PERMISSIONS AND ROLES'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Group Delegated Permissions And Roles'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAService {objectid: $objectid})-[r1:MemberOf*1..]->(n:IPAPermission|IPARole)'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Permissions And Roles'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=shortestPath((m:IPAService {objectid: $objectid})-[r1:MemberOf*1..]->(n:IPAPermission|IPARole))'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Potencial Permissions And Roles'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAService {objectid: $objectid})-[]->(n:IPAPermission|IPARole)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'INBOUND CONTROL RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Explicit Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(n)-[r]->(u1:IPAService {objectid:$objectid}) WHERE r.isacl=true'
                                }
                                end={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((n)-[r1*1..]->(u1:IPAService {objectid:$objectid}))'
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
                                    'MATCH p = (c:IPAService {objectid: $objectid})-[r]->(n) WHERE r.isacl=true'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((c:IPAService {objectid: $objectid})-[r*1..]->(n))'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>
                {}
            </div>
        </div>
    );
};

IPAServiceNodeData.propTypes = {};
export default IPAServiceNodeData;
