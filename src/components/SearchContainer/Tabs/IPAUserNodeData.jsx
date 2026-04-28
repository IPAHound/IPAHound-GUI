import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import CollapsibleSection from './Components/CollapsibleSection';
import NodeCypherLinkComplex from './Components/NodeCypherLinkComplex';
import NodeCypherLink from './Components/NodeCypherLink';
import NodeCypherNoNumberLink from './Components/NodeCypherNoNumberLink';
import MappedNodeProps from './Components/MappedNodeProps';
import ExtraNodeProps from './Components/ExtraNodeProps';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import { withAlert } from 'react-alert';
import { Table } from 'react-bootstrap';
import styles from './NodeData.module.css';
import { useContext } from 'react';
import { AppContext } from '../../../AppContext';

const IPAUserNodeData = () => {
    const [visible, setVisible] = useState(false);
    const [objectId, setObjectId] = useState(null);
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
        if (type === 'IPAUser') {
            setVisible(true);
            setObjectId(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAUser {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
                .then((r) => {
                    let props = r.records[0].get('node').properties;
                    setNodeProps(props);
                    setLabel(props.name || props.azname || objectid);
                    session.close();
                });
        } else {
            setObjectId(null);
            setVisible(false);
        }
    };

    const displayMap = {
        displayName: 'Display Name',
        objectid: 'Object ID',
        krbLastPwdChange: 'Password Last Changed',
        enabled: 'Enabled',
        mail: 'Email',
        homeDirectory: 'Home Directory',
        description: 'Description',
        userpassword: 'User Password',
        owned: 'Compromised',
        loginShell: 'Login shell',
        uidNumber: "UID Number",
        ipaUserAuthType: "User Auth Type",
        PasswordAuthAllow: "Allow Password Auth",
    };

    return objectId === null ? (
        <div></div>
    ) : (
        <div
            className={clsx(
                !visible && 'displaynone',
                context.darkMode ? styles.dark : styles.light
            )}
        >
            <div className={clsx(styles.dl)}>
                <h5>{label || objectId}</h5>

                <CollapsibleSection header='OVERVIEW'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Reachable High Value Targets'
                                target={objectId}
                                baseQuery={
                                    'MATCH (m:IPAUser {objectid: $objectid}),(n {highvalue:true}),p=shortestPath((m)-[r*1..]->(n)) WHERE NONE (r IN relationships(p) WHERE type(r)= "GetChanges") AND NONE (r in relationships(p) WHERE type(r)="GetChangesAll") AND NOT m=n'
                                }
                                start={label}
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <MappedNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <ExtraNodeProps
                    displayMap={displayMap}
                    properties={nodeProps}
                    label={label}
                />

                <hr></hr>

                <CollapsibleSection header={'GROUP MEMBERSHIP'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Unrolled Group Membership'
                                target={objectId}
                                baseQuery={
                                    'MATCH p = (m:IPAUser {objectid: $objectid})-[r:MemberOf*1..]->(n:IPAGroup)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'SSH RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree SSH rights'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(m:IPAUser {objectid: $objectid})-[r:CanSSH]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Unrolled SSH rights'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(m:IPAUser {objectid: $objectid})-[r1:MemberOf|AddMember*0..]->()-[r2:CanSSH]->()<-[r3:MemberOf*0..]-(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header={'SUDO RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Sudo rights'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(m:IPAUser {objectid: $objectid})-[r:CanSUDO]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Unrolled Sudo rights'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(m:IPAUser {objectid: $objectid})-[r1:MemberOf|AddMember*0..]->()-[r2:CanSUDO]->()<-[r3:MemberOf*0..]-(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <CollapsibleSection header={'SSH + SUDO RIGHTS'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Sudo rights'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(m:IPAUser {objectid: $objectid})-[r:CanSUDO|CanSSH]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Unrolled Sudo rights'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(m:IPAUser {objectid: $objectid})-[r1:MemberOf|AddMember*0..]->()-[r2:CanSUDO|CanSSH]->()<-[r3:MemberOf*0..]-(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'USER PERMISSIONS AND ROLES'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Group Delegated Permissions And Roles'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(m:IPAUser {objectid: $objectid})-[r1:MemberOf*1..]->(n:IPAPermission|IPARole)'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Permissions And Roles'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=shortestPath((m:IPAUser {objectid: $objectid})-[r1:MemberOf*1..]->(n:IPAPermission|IPARole))'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Potencial Permissions And Roles'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(m:IPAUser {objectid: $objectid})-[]->(n:IPAPermission|IPARole)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'OUTBOUND OBJECT CONTROL'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Object Control'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(u:IPAUser {objectid: $objectid})-[r1]->(n) WHERE r1.isacl=true'
                                }
                                end={label}
                                distinct
                            />
                            <NodeCypherLink
                                property='Group Delegated Object Control'
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(u:IPAUser {objectid: $objectid})-[r1:MemberOf*1..]->(g:IPAGroup)-[r2]->(n) WHERE r2.isacl=true'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Control'
                                target={objectId}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid MATCH p=shortestPath((u:IPAUser {objectid: $objectid})-[r1*1..]->(n))'
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
                                target={objectId}
                                baseQuery={
                                    'MATCH p=(n)-[r]->(u1:IPAUser {objectid: $objectid}) WHERE r.isacl=true'
                                }
                                end={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Controllers'
                                target={objectId}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid MATCH p = shortestPath((n)-[r1*1..]->(u1:IPAUser {objectid: $objectid}))'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                {/* <Notes objectid={objectId} type={'User'} />
                <NodeGallery
                    objectid={objectId}
                    type={'User'}
                    visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAUserNodeData.propTypes = {};
export default withAlert()(IPAUserNodeData);
