import clsx from 'clsx';
import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { AppContext } from '../../../AppContext';
import CollapsibleSection from './Components/CollapsibleSection';
import ExtraNodeProps from './Components/ExtraNodeProps';
import MappedNodeProps from './Components/MappedNodeProps';
import NodeCypherLink from './Components/NodeCypherLink';
import NodePlayCypherLink from './Components/NodePlayCypherLink';
import styles from './NodeData.module.css';

const IPAGroupNodeData = () => {
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
        if (type === 'IPAGroup') {
            setVisible(true);
            setObjectid(id);
            setDomain(domain);
            let session = driver.session();
            session
                .run(`MATCH (n:IPAGroup {objectid: $objectid}) RETURN n AS node`, {
                    objectid: id,
                })
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
        description: 'Description',
        NetGroup: 'isNetGroup',
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
                                    'MATCH (m:IPAGroup {objectid: $objectid}),(n {highvalue:true}),p=shortestPath((m)-[r*1..]->(n)) WHERE NONE (r IN relationships(p) WHERE type(r)= "GetChanges") AND NONE (r in relationships(p) WHERE type(r)="GetChangesAll") AND NOT m=n'
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

                <CollapsibleSection header='IPAGROUP MEMBERS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Unrolled Members'
                                target={objectid}
                                baseQuery={
                                    'MATCH p =(n)-[r:MemberOf*1..]->(g:IPAGroup {objectid: $objectid})'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='IPAGROUP MEMBERSHIP'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Unrolled Member Of'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (g1:IPAGroup {objectid: $objectid})-[r:MemberOf*1..]->(n)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='SSH RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree SSH Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAGroup {objectid: $objectid})-[r:CanSSH]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />

                            <NodeCypherLink
                                property='IPAGroup Delegated SSH Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (g1:IPAGroup {objectid: $objectid})-[r1:MemberOf*1..]->(g2:IPAGroup)-[r2:CanSSH]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />

                            <NodePlayCypherLink
                                property='Unrolled SSH Rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAGroup {objectid: $objectid})-[r1:MemberOf*0..]->()-[r2:CanSSH]->()<-[r3:MemberOf*0..]-(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='SUDO RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree SUDO rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAGroup {objectid: $objectid})-[r:CanSUDO]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />

                            <NodeCypherLink
                                property='IPAGroup Delegated SUDO rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (g1:IPAGroup {objectid: $objectid})-[r1:MemberOf*1..]->(g2:IPAGroup)-[r2:CanSUDO]->(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />

                            <NodePlayCypherLink
                                property='Unrolled SUDO rights'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAGroup {objectid: $objectid})-[r1:MemberOf*0..]->()-[r2:CanSUDO]->()<-[r3:MemberOf*0..]-(n:IPAComputer)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header={'GROUP PERMISSIONS AND ROLES'}>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Permissions And Roles'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAGroup {objectid: $objectid})-[r1:MemberOf*1..]->(n:IPAPermission|IPARole)'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Permissions And Roles'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=shortestPath((m:IPAGroup {objectid: $objectid})-[r1:MemberOf*1..]->(n:IPAPermission|IPARole))'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Potencial Permissions And Roles'
                                target={objectid}
                                baseQuery={
                                    'MATCH p=(m:IPAGroup {objectid: $objectid})-[]->(n:IPAPermission|IPARole)'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='OUTBOUND OBJECT CONTROL'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='First Degree Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (g:IPAGroup {objectid: $objectid})-[r]->(n) WHERE r.isacl=true'
                                }
                                start={label}
                                distinct
                            />
                            <NodeCypherLink
                                property='IPAGroup Delegated Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (g1:IPGroup {objectid: $objectid})-[r1:MemberOf*1..]->(g2:IPAGroup)-[r2]->(n) WHERE r2.isacl=true'
                                }
                                start={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Control'
                                target={objectid}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((g:IPAGroup {objectid: $objectid})-[r:MemberOf|ForceChangePassword|ReadKerberosKey|AddMember|Owns|AddRBCD*1..]->(n))'
                                }
                                start={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                <hr></hr>

                <CollapsibleSection header='INBOUND CONTROL RIGHTS'>
                    <div className={styles.itemlist}>
                        <Table>
                            <thead></thead>
                            <tbody className='searchable'>
                            <NodeCypherLink
                                property='Explicit Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH p = (n)-[r]->(g:IPAGroup {objectid: $objectid})'
                                }
                                end={label}
                                distinct
                            />
                            <NodePlayCypherLink
                                property='Transitive Object Controllers'
                                target={objectid}
                                baseQuery={
                                    'MATCH (n) WHERE NOT n.objectid=$objectid WITH n MATCH p = shortestPath((n)-[r*1..]->(g:IPAGroup {objectid: $objectid}))'
                                }
                                end={label}
                                distinct
                            />
                            </tbody>
                        </Table>
                    </div>
                </CollapsibleSection>

                {/*  <Notes objectid={objectid} type='Group' />
                 <NodeGallery
                     objectid={objectid}
                     type='Group'
                     visible={visible}
                /> */}
            </div>
        </div>
    );
};

IPAGroupNodeData.propTypes = {};
export default IPAGroupNodeData;
